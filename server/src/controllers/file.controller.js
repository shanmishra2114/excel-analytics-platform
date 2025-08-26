import File from '../models/File.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import * as XLSX from 'xlsx';

const mapFile = (f, withData = null) => ({
  id: f._id.toString(),
  filename: f.originalName,
  originalName: f.originalName,
  uploadedAt: f.createdAt,
  size: f.size,
  status: f.status,
  columns: f.columns || [],
  ...(withData ? { data: withData } : {}),
});

const uploadBufferToCloudinary = (buffer, folder, filename) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'raw', public_id: filename },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

export const uploadAndParse = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { originalname, mimetype, size, buffer } = req.file;

    // Parse Excel/CSV from memory
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    const json = XLSX.utils.sheet_to_json(worksheet, { defval: null });
    const columns = json.length ? Object.keys(json[0]) : [];
    const preview = json.slice(0, 200); // limit to first 200 rows

    // Upload original file to Cloudinary
    const folder = `excel-analytics/${req.user.id}`;
    const baseName = originalname.replace(/\.[^.]+$/, '');
    const uploaded = await uploadBufferToCloudinary(buffer, folder, baseName);

    const fileDoc = await File.create({
      user: req.user.id,
      originalName: originalname,
      filename: uploaded.public_id,
      url: uploaded.secure_url,
      mimeType: mimetype,
      size,
      status: 'completed',
      columns,
      rowCount: json.length,
      cloudinaryId: uploaded.public_id,
    });

    res.json(mapFile(fileDoc, preview));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process file' });
  }
};

export const listFiles = async (req, res) => {
  const files = await File.find({ user: req.user.id }).sort({ createdAt: -1 });

  // For listing, include small preview to enable immediate charting
  const results = files.map((f) => mapFile(f));
  res.json(results);
};

export const removeFile = async (req, res) => {
  const { id } = req.params;
  const file = await File.findOne({ _id: id, user: req.user.id });
  if (!file) return res.status(404).json({ message: 'File not found' });

  try {
    if (file.cloudinaryId) {
      await cloudinary.uploader.destroy(file.cloudinaryId, { resource_type: 'raw' });
    }
    await file.deleteOne();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete file' });
  }
};
