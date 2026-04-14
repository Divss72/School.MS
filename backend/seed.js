const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Task = require('./models/Task');
const Notice = require('./models/Notice');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');

dotenv.config();

const importData = async () => {
  console.log('--- SEEDING INDIAN NAMES ---', ['Aarav Sharma', 'Isha Gupta', 'Rohan Das']);
  try {
    await User.deleteMany();
    await Student.deleteMany();
    await Task.deleteMany();
    await Notice.deleteMany();

    // Create Admin
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await User.create({
      email: 'admin@school.com',
      password: hashedPassword,
      role: 'admin',
    });

    // Create Students
    const student1 = await User.create({ email: 's1@school.com', password: hashedPassword, role: 'student' });
    const student2 = await User.create({ email: 's2@school.com', password: hashedPassword, role: 'student' });
    const student3 = await User.create({ email: 's3@school.com', password: hashedPassword, role: 'student' });

    const s1 = await Student.create({ userId: student1._id, name: 'Aarav Sharma', class: '10A', email: 's1@school.com' });
    const s2 = await Student.create({ userId: student2._id, name: 'Isha Gupta', class: '10B', email: 's2@school.com' });
    const s3 = await Student.create({ userId: student3._id, name: 'Rohan Das', class: '9A', email: 's3@school.com' });

    // Create Tasks
    await Task.create({
      title: 'Math Worksheet 4',
      description: 'Complete the algebra section.',
      assignedTo: [s1._id, s2._id],
      dueDate: new Date(Date.now() + 86400000 * 3), // +3 days
      status: 'Pending',
      submissions: []
    });

    await Task.create({
      title: 'Science Project',
      description: 'Volcano model',
      assignedTo: [s1._id],
      dueDate: new Date(Date.now() - 86400000 * 1), // -1 day
      status: 'Submitted',
      submissions: [{ studentId: s1._id, text: 'Done', submittedAt: Date.now() }]
    });

    // Create Notices
    await Notice.create({ title: 'Welcome Back', content: 'School starts!', type: 'Announcement' });
    await Notice.create({ title: 'Summer Break', content: 'Enjoy your holidays.', type: 'Holiday' });
    await Notice.create({ title: 'Mid-terms', content: 'Exams in 2 weeks.', type: 'Exam' });

    console.log('Seed data imported!');
  } catch (error) {
    console.error(`Error with seed: ${error.message}`);
  }
};

module.exports = importData;
