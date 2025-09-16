export async function withTransaction(callback) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

export function createAggregationPipeline(filters = {}, sort = {}, limit = null) {
  const pipeline = [];

  // Match stage
  if (Object.keys(filters).length > 0) {
    pipeline.push({ $match: filters });
  }

  // Sort stage
  if (Object.keys(sort).length > 0) {
    pipeline.push({ $sort: sort });
  }

  // Limit stage
  if (limit) {
    pipeline.push({ $limit: limit });
  }

  return pipeline;
}

export async function paginate(model, query = {}, options = {}) {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    populate = null
  } = options;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate),
    model.countDocuments(query)
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
}