const asyncWrapper = require('../utils/asyncWrapper');
const { successResponse } = require('../utils/responseHelper');
const studentService = require('../services/studentService');

const getStudents = asyncWrapper(async (req, res) => {
  const students = await studentService.getStudents();
  return successResponse(res, students);
});

const createStudent = asyncWrapper(async (req, res) => {
  console.log('CONTROLLER: Creating student with body:', req.body);
  const student = await studentService.createStudent(req.body);
  console.log('CONTROLLER: Student created successfully');
  return successResponse(res, student, 'Student created', 201);
});

const updateStudent = asyncWrapper(async (req, res) => {
  const student = await studentService.updateStudent(req.params.id, req.body);
  return successResponse(res, student, 'Student updated');
});

const deleteStudent = asyncWrapper(async (req, res) => {
  await studentService.deleteStudent(req.params.id);
  return successResponse(res, null, 'Student deleted');
});

module.exports = { getStudents, createStudent, updateStudent, deleteStudent };
