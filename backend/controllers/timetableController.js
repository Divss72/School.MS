const asyncWrapper = require('../utils/asyncWrapper');
const { successResponse } = require('../utils/responseHelper');
const timetableService = require('../services/timetableService');
const Student = require('../models/Student');

const getTimeTables = asyncWrapper(async (req, res) => {
  let filter = {};
  if (req.user.role === 'student') {
    // For students, find their class and filter timetable
    const student = await Student.findOne({ userId: req.user.id });
    if (student) {
      filter.class = student.class;
    }
  } else if (req.query.class) {
    filter.class = req.query.class;
  }
  
  const timetables = await timetableService.getTimeTables(filter);
  return successResponse(res, timetables);
});

const createOrUpdateTimeTable = asyncWrapper(async (req, res) => {
  const timetable = await timetableService.createOrUpdateTimeTable(req.body);
  return successResponse(res, timetable, 'Time table updated', 201);
});

const deleteTimeTable = asyncWrapper(async (req, res) => {
  await timetableService.deleteTimeTable(req.params.id);
  return successResponse(res, null, 'Time table deleted');
});

module.exports = { getTimeTables, createOrUpdateTimeTable, deleteTimeTable };
