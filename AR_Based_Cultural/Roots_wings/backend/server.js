const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { exec } = require('child_process');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5500;

const server = app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  exec(`start http://localhost:${PORT}`);
});

/* 🔒 Prevent duplicate listen crash */
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} already in use`);
    process.exit(1);
  }
});
