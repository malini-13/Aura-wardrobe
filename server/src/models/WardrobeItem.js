import mongoose from 'mongoose';

const wardrobeItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    subcategory: { type: String, trim: true, maxlength: 80 },
    color: { type: String, trim: true, maxlength: 40 },
    colors: [{ type: String, trim: true, maxlength: 40 }],
    style: { type: String, trim: true, maxlength: 80 },
    pattern: { type: String, trim: true, maxlength: 60 },
    fit: { type: String, trim: true, maxlength: 60 },
    sleeveType: { type: String, trim: true, maxlength: 60 },
    formality: { type: Number, min: 1, max: 5 },
    comfort: { type: Number, min: 1, max: 5 },
    occasions: [{ type: String, trim: true, maxlength: 60 }],
    imageUrl: { type: String, trim: true },
    avatarAssetKey: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model('WardrobeItem', wardrobeItemSchema);
