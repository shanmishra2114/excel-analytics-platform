import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    originalName: { type: String, required: true },
    filename: { type: String, required: true }, // Cloudinary public_id
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    status: { type: String, enum: ['processing', 'completed', 'error'], default: 'processing' },
    columns: [{ type: String }],
    rowCount: { type: Number, default: 0 },
    cloudinaryId: { type: String },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export default mongoose.model('File', fileSchema);
