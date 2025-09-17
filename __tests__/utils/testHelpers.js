import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod;

export async function connectToTestDb() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
}

export async function clearTestDb() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

export async function disconnectFromTestDb() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

export function createMockUser() {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User'
  };
}

export function createMockStudyBlock() {
  return {
    title: 'Test Study Block',
    date: '2024-12-01',
    startTime: '14:00',
    endTime: '16:00',
    description: 'Test description'
  };
}