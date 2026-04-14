const User = require('../models/User');

// GET /api/v1/students (Admin)
const getStudents = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          role: 'student',
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : { role: 'student' };

    const students = await User.find(keyword).select('-password');
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/students (Admin)
const createStudent = async (req, res) => {
  try {
    const { name, email, password, studentClass } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const student = await User.create({
      name,
      email,
      password,
      role: 'student',
      class: studentClass,
    });

    res.status(201).json({
      success: true,
      data: { _id: student._id, name: student.name, email: student.email, class: student.class },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/v1/students/:id (Admin)
const deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (student) {
      await User.deleteOne({ _id: req.params.id });
      res.json({ success: true, message: 'Student removed' });
    } else {
      res.status(404).json({ success: false, message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/v1/students/:id (Admin)
const updateStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (student) {
      student.name = req.body.name || student.name;
      student.email = req.body.email || student.email;
      student.class = req.body.studentClass || student.class;

      if (req.body.password) {
        student.password = req.body.password;
      }

      const updatedStudent = await student.save();
      res.json({
        success: true,
        data: { _id: updatedStudent._id, name: updatedStudent.name, email: updatedStudent.email, class: updatedStudent.class },
      });
    } else {
      res.status(404).json({ success: false, message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStudents, createStudent, deleteStudent, updateStudent };
