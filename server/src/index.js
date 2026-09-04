import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import WardrobeItem from './models/WardrobeItem.js';
import { connectToDatabase, isDatabaseConnected } from './db.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

function requireDatabase(_, res, next) {
  if (!isDatabaseConnected()) {
    return res.status(503).json({ error: 'Database is currently unavailable.' });
  }
  next();
}

app.get('/api/health', async (_, res) => {
  let database = 'disconnected';

  try {
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
      database = 'connected';
    }
  } catch {
    database = 'disconnected';
  }

  res.json({ status: 'ok', service: 'aura-api', database });
});

app.get('/api/wardrobe', requireDatabase, async (_, res, next) => {
  try {
    const wardrobe = await WardrobeItem.find().sort({ createdAt: -1 });
    res.json(wardrobe);
  } catch (error) {
    next(error);
  }
});

app.post('/api/wardrobe', requireDatabase, async (req, res, next) => {
  try {
    const item = await WardrobeItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

app.patch('/api/wardrobe/:id', requireDatabase, async (req, res, next) => {
  try {
    const item = await WardrobeItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.sendStatus(404);
    res.json(item);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/wardrobe/:id', requireDatabase, async (req, res, next) => {
  try {
    const item = await WardrobeItem.findByIdAndDelete(req.params.id);
    if (!item) return res.sendStatus(404);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
app.post('/api/stylist/recommend',(req,res)=>res.json({message:'Connect this endpoint to recommendationService.js after MongoDB is configured.',request:req.body,looks:[]}));
app.post('/api/outfits/:id/feedback',(req,res)=>res.json({ok:true,feedback:req.body}));

app.use((error, _, res, __) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: 'Invalid wardrobe item data.', details: error.message });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid wardrobe item ID.' });
  }
  console.error('Request failed:', error.message);
  res.status(500).json({ error: 'Internal server error.' });
});

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  console.log(`Aura API listening on ${port}`);
  await connectToDatabase();
});
