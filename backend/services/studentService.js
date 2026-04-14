const Student = require('../models/Student');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getStudents = async () => {
  return await Student.find({}).populate('userId', 'email role');
};

const createStudent = async (studentData) => {
  const { name, email, class: className, password } = studentData;

  if (!password) {
    throw new Error('Password is required');
  }

  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create User account
  const newUser = await User.create({
    email,
    password: hashedPassword,
    role: 'student'
  });

  // 4. Create Student profile
  try {
    return await Student.create({
      userId: newUser._id,
      name,
      email,
      class: className
    });
  } catch (err) {
    // Cleanup user if student creation fails
    await User.findByIdAndDelete(newUser._id);
    throw err;
  }
};

const updateStudent = async (id, updateData) => {
  // If email is updated, we should update both records
  if (updateData.email) {
    const student = await Student.findById(id);
    if (student) {
      await User.findByIdAndUpdate(student.userId, { email: updateData.email });
    }
  }
  return await Student.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteStudent = async (id) => {
  const student = await Student.findById(id);
  if (student) {
    // Delete both User and Student
    await User.findByIdAndDelete(student.userId);
    return await Student.findByIdAndDelete(id);
  }
  return null;
};

module.exports = { getStudents, createStudent, updateStudent, deleteStudent };
