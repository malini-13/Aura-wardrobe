import mongoose from 'mongoose';

export async function connectToDatabase() {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    console.error('MongoDB connection is not configured: MONGODB_URI is missing.');
    return false;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10_000,
    });
    console.log('MongoDB connected successfully.');
    return true;
  } catch (error) {
    console.error('MongoDB connection failed. Check Atlas network access and configuration.');
    return false;
  }
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

export async function getDatabaseHealth() {
  if (!isDatabaseConnected() || !mongoose.connection.db) {
    return 'disconnected';
  }

  try {
    await mongoose.connection.db.admin().ping();
    return 'connected';
  } catch {
    return 'disconnected';
  }
}

mongoose.connection.on('error', () => {
  console.error('MongoDB connection error. Database requests may be unavailable.');
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected.');
});
