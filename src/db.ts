import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chalk from 'chalk';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || process.env.MONGO_URI;

if (!MONGO_URL) {
  throw new Error(
    'MongoDB connection URL not found. Please define either MONGO_URL or MONGO_URI in your environment variables.'
  );
}

// Validate MongoDB URL format
const MONGODB_URL_REGEX = /^mongodb(?:\+srv)?:\/\/.+/;
if (!MONGODB_URL_REGEX.test(MONGO_URL)) {
  throw new Error(
    'Invalid MongoDB URL format. URL must start with mongodb:// or mongodb+srv://'
  );
}

interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  client: mongoose.mongo.MongoClient | null;
  db: mongoose.mongo.Db | null;
}

const cache: ConnectionCache = {
  conn: null,
  promise: null,
  client: null,
  db: null
};

async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) {
    console.log(chalk.grey('Using cached MongoDB connection'));
    return cache.conn;
  }

  if (!cache.promise) {
    console.log(chalk.grey('Creating new MongoDB connection'));
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    };

    cache.promise = mongoose.connect(MONGO_URL!, opts).then((mongoose) => {
      cache.client = mongoose.connection.getClient();
      cache.db = cache.client.db();
      return mongoose;
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = null;
    cache.client = null;
    cache.db = null;
    throw e;
  }

  return cache.conn;
}

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error(chalk.red('MongoDB connection error:'), err);
});

mongoose.connection.once('open', () => {
  console.log(chalk.green('Connected to MongoDB'));
});

// Handle process termination
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState === 1) {
    console.log(chalk.yellow('Closing MongoDB connection'));
    await mongoose.connection.close();
  }
  process.exit(0);
});

// Helper functions to get database instances
export function getDb(): mongoose.mongo.Db {
  if (!cache.db) {
    throw new Error('Database not initialized. Call connectDB() first.');
  }
  return cache.db;
}

export function getMongoClient(): mongoose.mongo.MongoClient {
  if (!cache.client) {
    throw new Error('MongoDB client not initialized. Call connectDB() first.');
  }
  return cache.client;
}

// Export database utilities
export const db = {
  async getInstance() {
    await connectDB();
    if (!cache.db) throw new Error('Database not initialized');
    return cache.db;
  },
  get instance() {
    if (!cache.db) throw new Error('Please use getInstance() to ensure database connection');
    return cache.db;
  }
};

export const MC = {
  async getClient() {
    await connectDB();
    if (!cache.client) throw new Error('MongoDB client not initialized');
    return cache.client;
  },
  get client() {
    if (!cache.client) throw new Error('Please use getClient() to ensure database connection');
    return cache.client;
  }
};

// Initialize connection but don't wait for it
connectDB().catch((error) => {
  console.error(chalk.red('Failed to initialize MongoDB connection:'), error);
});

export { connectDB };
export default connectDB; 