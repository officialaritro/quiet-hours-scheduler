import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiet-hours-scheduler';
const MONGODB_DB = process.env.MONGODB_DB || 'quiet-hours-scheduler';

// In-memory fallback for development
let memoryDb = {
  users: new Map(),
  studyBlocks: new Map(),
  sessions: new Map()
};

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // Try MongoDB first
  try {
    if (cachedClient && cachedDb) {
      return { client: cachedClient, db: cachedDb };
    }

    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    const db = client.db(MONGODB_DB);

    cachedClient = client;
    cachedDb = db;

    console.log('Connected to MongoDB');
    return { client, db };
  } catch (error) {
    console.warn('MongoDB connection failed, using in-memory storage:', error.message);
    
    // Return in-memory database interface
    return {
      client: null,
      db: {
        collection: (name) => ({
          findOne: async (query) => {
            const collection = memoryDb[name] || new Map();
            for (let [id, doc] of collection) {
              if (matchesQuery(doc, query)) {
                return { ...doc, _id: id };
              }
            }
            return null;
          },
          
          find: async (query = {}) => ({
            toArray: async () => {
              const collection = memoryDb[name] || new Map();
              const results = [];
              for (let [id, doc] of collection) {
                if (matchesQuery(doc, query)) {
                  results.push({ ...doc, _id: id });
                }
              }
              return results;
            }
          }),
          
          insertOne: async (doc) => {
            if (!memoryDb[name]) memoryDb[name] = new Map();
            const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            memoryDb[name].set(id, { ...doc, createdAt: new Date() });
            return { insertedId: id };
          },
          
          updateOne: async (query, update) => {
            const collection = memoryDb[name] || new Map();
            for (let [id, doc] of collection) {
              if (matchesQuery(doc, query)) {
                const updatedDoc = applyUpdate(doc, update);
                collection.set(id, updatedDoc);
                return { modifiedCount: 1 };
              }
            }
            return { modifiedCount: 0 };
          },
          
          deleteOne: async (query) => {
            const collection = memoryDb[name] || new Map();
            for (let [id, doc] of collection) {
              if (matchesQuery(doc, query)) {
                collection.delete(id);
                return { deletedCount: 1 };
              }
            }
            return { deletedCount: 0 };
          }
        })
      }
    };
  }
}

// Helper function to match queries in memory database
function matchesQuery(doc, query) {
  if (!query || Object.keys(query).length === 0) return true;
  
  for (let [key, value] of Object.entries(query)) {
    if (doc[key] !== value) return false;
  }
  return true;
}

// Helper function to apply updates in memory database
function applyUpdate(doc, update) {
  const newDoc = { ...doc };
  
  if (update.$set) {
    Object.assign(newDoc, update.$set);
  }
  
  if (update.$inc) {
    for (let [key, value] of Object.entries(update.$inc)) {
      newDoc[key] = (newDoc[key] || 0) + value;
    }
  }
  
  newDoc.updatedAt = new Date();
  return newDoc;
}

export async function closeDatabaseConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}