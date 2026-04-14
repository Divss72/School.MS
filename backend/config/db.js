const mongoose = require('mongoose');
let MongoMemoryServer;
try {
  MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
} catch (e) {}

const connectDB = async () => {
  try {
    const isMemoryForced = process.env.USE_MEMORY_DB === 'true';
    let uri = process.env.MONGODB_URI;

    // Phase 1: Try Force Memory DB
    if (isMemoryForced) {
      console.log('Force Memory DB requested. Booting In-Memory MongoDB...');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      await mongoose.connect(uri);
      process.env.DB_MODE = 'memory';
      console.log('MongoDB Connected: In-Memory Mode');
      return;
    }

    // Phase 2: Try Connection with URI
    if (uri && uri !== 'your_mongodb_uri_here') {
      try {
        console.log(`Connecting to MongoDB: ${uri.split('@').pop()}`);
        const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        process.env.DB_MODE = (uri.includes('127.0.0.1') || uri.includes('localhost')) ? 'local' : 'remote';
        console.log(`MongoDB Connected: ${conn.connection.host} (Mode: ${process.env.DB_MODE})`);
        return;
      } catch (err) {
        console.warn(`Connection to ${uri} failed: ${err.message}`);
      }
    }

    // Phase 3: Fallback to Memory DB
    console.log('Falling back to In-Memory MongoDB...');
    const mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    await mongoose.connect(uri);
    process.env.DB_MODE = 'memory';
    console.log('MongoDB Connected: In-Memory (Fallback)');

  } catch (error) {
    console.error(`CRITICAL: Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
