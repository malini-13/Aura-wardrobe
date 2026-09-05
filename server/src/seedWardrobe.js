import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectToDatabase } from './db.js';
import { wardrobeSeed } from './data/wardrobeSeed.js';
import WardrobeItem from './models/WardrobeItem.js';

dotenv.config();

const validItems = wardrobeSeed.filter((item) => /^https?:\/\//i.test(item.imageUrl));
if (validItems.length !== wardrobeSeed.length) {
  console.error('Seed cancelled: every wardrobe item needs a real Cloudinary HTTP(S) URL.');
  process.exit(1);
}

if (!(await connectToDatabase())) process.exit(1);

try {
  await WardrobeItem.deleteMany({
    imageUrl: { $in: validItems.map((item) => item.imageUrl) },
    seedKey: { $nin: validItems.map((item) => item.seedKey) },
  });
  for (const item of validItems) {
    await WardrobeItem.findOneAndUpdate(
      { seedKey: item.seedKey },
      { ...item, occasions: item.tags },
      { upsert: true, new: true, runValidators: true },
    );
  }
  console.log(`Seeded ${validItems.length} wardrobe outfits.`);
} catch (error) {
  console.error('Wardrobe seed failed:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
