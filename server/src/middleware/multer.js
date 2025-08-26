import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowed = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only Excel or CSV files are allowed'));
};

export const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter });
