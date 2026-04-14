const asyncWrapper = require('../utils/asyncWrapper');
const { successResponse } = require('../utils/responseHelper');
const activityService = require('../services/activityService');
const Student = require('../models/Student');

const getActivities = asyncWrapper(async (req, res) => {
  const activities = await activityService.getActivities();
  return successResponse(res, activities);
});

const createActivity = asyncWrapper(async (req, res) => {
  const activity = await activityService.createActivity(req.body);
  return successResponse(res, activity, 'Activity created', 201);
});

const enrollInActivity = asyncWrapper(async (req, res) => {
  const student = await Student.findOne({ userId: req.user.id });
  if (!student) throw new Error('Student profile not found');

  const enrollment = await activityService.enrollInActivity(student._id, req.body.activityId, req.body.note);
  return successResponse(res, enrollment, 'Enrolled successfully', 201);
});

const getEnrollments = asyncWrapper(async (req, res) => {
  let filter = {};
  if (req.user.role === 'student') {
    const student = await Student.findOne({ userId: req.user.id });
    if (student) filter.studentId = student._id;
  }
  const enrollments = await activityService.getEnrollments(filter);
  return successResponse(res, enrollments);
});

module.exports = { getActivities, createActivity, enrollInActivity, getEnrollments };
