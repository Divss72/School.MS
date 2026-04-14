const asyncWrapper = require('../utils/asyncWrapper');
const { successResponse } = require('../utils/responseHelper');
const resultService = require('../services/resultService');
const Student = require('../models/Student');

const getResults = asyncWrapper(async (req, res) => {
  let filter = {};
  if (req.user.role === 'student') {
    const student = await Student.findOne({ userId: req.user.id });
    if (student) {
      filter.studentId = student._id;
    }
  } else if (req.query.studentId) {
    filter.studentId = req.query.studentId;
  }
  
  const results = await resultService.getResults(filter);
  return successResponse(res, results);
});

const createResult = asyncWrapper(async (req, res) => {
  const result = await resultService.createResult(req.body);
  return successResponse(res, result, 'Result added', 201);
});

const getStudentProgress = asyncWrapper(async (req, res) => {
  const progress = await resultService.getStudentProgress(req.params.studentId);
  return successResponse(res, progress);
});

module.exports = { getResults, createResult, getStudentProgress };
