const Activity = require('../models/Activity');
const ActivityEnrollment = require('../models/ActivityEnrollment');

const getActivities = async () => {
  return await Activity.find({}).sort({ createdAt: -1 });
};

const createActivity = async (data) => {
  return await Activity.create(data);
};

const enrollInActivity = async (studentId, activityId, note) => {
  return await ActivityEnrollment.create({ studentId, activityId, note });
};

const getEnrollments = async (filter = {}) => {
  return await ActivityEnrollment.find(filter)
    .populate('studentId', 'name class')
    .populate('activityId', 'name type')
    .sort({ createdAt: -1 });
};

module.exports = { getActivities, createActivity, enrollInActivity, getEnrollments };
