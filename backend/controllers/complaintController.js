const asyncWrapper = require('../utils/asyncWrapper');
const { successResponse } = require('../utils/responseHelper');
const complaintService = require('../services/complaintService');
const Student = require('../models/Student');

const getComplaints = asyncWrapper(async (req, res) => {
  let filter = {};
  if (req.user.role === 'student') {
    const student = await Student.findOne({ userId: req.user.id });
    if (student) filter.studentId = student._id;
  }
  const complaints = await complaintService.getComplaints(filter);
  return successResponse(res, complaints);
});

const createComplaint = asyncWrapper(async (req, res) => {
  const student = await Student.findOne({ userId: req.user.id });
  if (!student) throw new Error('Student profile not found');
  
  const complaint = await complaintService.createComplaint({
    ...req.body,
    studentId: student._id
  });
  return successResponse(res, complaint, 'Complaint registered successfully', 201);
});

const updateComplaintStatus = asyncWrapper(async (req, res) => {
  const { status, adminComment } = req.body;
  const complaint = await complaintService.updateComplaintStatus(req.params.id, status, adminComment);
  return successResponse(res, complaint, 'Complaint updated');
});

module.exports = { getComplaints, createComplaint, updateComplaintStatus };
