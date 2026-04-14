const Result = require('../models/Result');

const getResults = async (filter = {}) => {
  return await Result.find(filter).populate('studentId', 'name class').sort({ createdAt: -1 });
};

const createResult = async (resultData) => {
  // Calculate total percentage and grade if not provided
  const totalObtained = resultData.subjects.reduce((sum, s) => sum + s.marksObtained, 0);
  const totalMax = resultData.subjects.reduce((sum, s) => sum + s.totalMarks, 0);
  resultData.totalPercentage = (totalObtained / totalMax) * 100;
  
  if (resultData.totalPercentage >= 90) resultData.grade = 'A+';
  else if (resultData.totalPercentage >= 80) resultData.grade = 'A';
  else if (resultData.totalPercentage >= 70) resultData.grade = 'B';
  else if (resultData.totalPercentage >= 60) resultData.grade = 'C';
  else if (resultData.totalPercentage >= 50) resultData.grade = 'D';
  else resultData.grade = 'F';

  return await Result.create(resultData);
};

const getStudentProgress = async (studentId) => {
  return await Result.find({ studentId }).sort({ createdAt: 1 });
};

module.exports = { getResults, createResult, getStudentProgress };
