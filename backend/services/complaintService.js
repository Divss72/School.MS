const Complaint = require('../models/Complaint');

const getComplaints = async (filter = {}) => {
  return await Complaint.find(filter).populate('studentId', 'name class email').sort({ createdAt: -1 });
};

const createComplaint = async (data) => {
  return await Complaint.create(data);
};

const updateComplaintStatus = async (id, status, adminComment) => {
  return await Complaint.findByIdAndUpdate(id, { status, adminComment }, { new: true });
};

module.exports = { getComplaints, createComplaint, updateComplaintStatus };
