import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const mapUser = (u) => ({
  id: u._id.toString(),
  email: u.email,
  name: u.name,
  role: u.role,
  createdAt: u.createdAt,
});

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already in use' });

  const passwordHash = await bcrypt.hash(password, 10);

  // Make first user admin automatically
  const usersCount = await User.countDocuments();
  const role = usersCount === 0 ? 'admin' : 'user';

  const user = await User.create({ name, email, passwordHash, role });
  const token = signToken(user._id);
  res.json({ user: mapUser(user), token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  const token = signToken(user._id);
  res.json({ user: mapUser(user), token });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id || req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(mapUser(user));
};
