const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/error.middleware');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api/v1', '') : 'http://localhost:5173',
  credentials: true,
}));

// Routes
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const taskRoutes = require('./routes/task.routes');
const noticeRoutes = require('./routes/notice.routes');
const timetableRoutes = require('./routes/timetable.routes');
const resultRoutes = require('./routes/result.routes');
const complaintRoutes = require('./routes/complaint.routes');
const activityRoutes = require('./routes/activity.routes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/notices', noticeRoutes);
app.use('/api/v1/timetable', timetableRoutes);
app.use('/api/v1/results', resultRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/activities', activityRoutes);

// Use Error Handler
app.use(errorHandler);

module.exports = app;
