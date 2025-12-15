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

/* API Routes */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

/* Frontend hosting */
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  exec(`start http://localhost:${PORT}`); // 🔥 auto open browser (Windows)
});
