import User from '../models/User.js';
import File from '../models/File.js';
import Chart from '../models/Chart.js';
import cloudinary from '../config/cloudinary.js';

export const listUsers = async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map((u) => ({
    id: u._id.toString(),
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt,
  })));
};

export const analytics = async (_req, res) => {
  const [totalUsers, totalUploads, totalCharts] = await Promise.all([
    User.countDocuments(),
    File.countDocuments(),
    Chart.countDocuments(),
  ]);

  const recentFiles = await File.find().sort({ createdAt: -1 }).limit(5).lean();
  const recentCharts = await Chart.find().sort({ createdAt: -1 }).limit(5).lean();

  const recentActivity = [
    ...recentFiles.map((f) => ({ type: 'file', id: f._id, when: f.createdAt, title: f.originalName })),
    ...recentCharts.map((c) => ({ type: 'chart', id: c._id, when: c.createdAt, title: c.title })),
  ].sort((a, b) => new Date(b.when) - new Date(a.when)).slice(0, 10);

  res.json({ totalUsers, totalUploads, totalCharts, recentActivity });
};

export const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ id: user._id.toString(), email: user.email, name: user.name, role: user.role, createdAt: user.createdAt });
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const files = await File.find({ user: userId });
  await Promise.all(files.map(async (f) => {
    if (f.cloudinaryId) await cloudinary.uploader.destroy(f.cloudinaryId, { resource_type: 'raw' });
    await f.deleteOne();
  }));
  await Chart.deleteMany({ user: userId });
  await user.deleteOne();

  res.status(200).json({ success: true });
};
