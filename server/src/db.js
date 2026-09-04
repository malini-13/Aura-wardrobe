import mongoose from 'mongoose';

let databaseConnected = false;

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
    databaseConnected = true;
    console.log('MongoDB connected successfully.');
    return true;
  } catch (error) {
    databaseConnected = false;
    console.error('MongoDB connection failed. Check Atlas network access and configuration.');
    return false;
  }
}

export function isDatabaseConnected() {
  return databaseConnected;
}

mongoose.connection.on('connected', () => {
  databaseConnected = true;
});

mongoose.connection.on('reconnected', () => {
  databaseConnected = true;
});

mongoose.connection.on('error', () => {
  console.error('MongoDB connection error. Database requests may be unavailable.');
});

mongoose.connection.on('disconnected', () => {
  databaseConnected = false;
  console.warn('MongoDB disconnected.');
});
