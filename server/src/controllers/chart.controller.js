import Chart from '../models/Chart.js';
import File from '../models/File.js';

const mapChart = (c, fileName) => ({
  id: c._id.toString(),
  type: c.type,
  xAxis: c.xAxis,
  yAxis: c.yAxis,
  title: c.title,
  fileId: c.file.toString(),
  createdAt: c.createdAt,
  fileName,
});

export const saveChart = async (req, res) => {
  const { type, xAxis, yAxis, title, fileId } = req.body;
  if (!type || !xAxis || !yAxis || !title || !fileId) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const file = await File.findOne({ _id: fileId, user: req.user.id });
  if (!file) return res.status(404).json({ message: 'File not found' });

  const chart = await Chart.create({ user: req.user.id, file: fileId, type, xAxis, yAxis, title });
  res.json(mapChart(chart, file.originalName));
};

export const listCharts = async (req, res) => {
  const charts = await Chart.find({ user: req.user.id }).sort({ createdAt: -1 }).populate('file');
  const results = charts.map((c) => mapChart(c, c.file?.originalName || ''));
  res.json(results);
};

export const removeChart = async (req, res) => {
  const { id } = req.params;
  const chart = await Chart.findOne({ _id: id, user: req.user.id });
  if (!chart) return res.status(404).json({ message: 'Chart not found' });
  await chart.deleteOne();
  res.status(200).json({ success: true });
};
