import mongoose from 'mongoose';

const chartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    file: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },
    type: { type: String, required: true },
    xAxis: { type: String, required: true },
    yAxis: { type: String, required: true },
    title: { type: String, required: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export default mongoose.model('Chart', chartSchema);
