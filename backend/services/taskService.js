const Task = require('../models/Task');

const getTasks = async (user) => {
  if (user.role === 'admin') {
    return await Task.find({}).populate('assignedTo', 'name class avatar').sort({ createdAt: -1 });
  } else {
    // We assume a real implementation bridges User ID to Student ID.
    // For demo, return tasks where assignedTo matches student doc or all if empty
    return await Task.find({}).sort({ dueDate: 1 });
  }
};

const createTask = async (taskData) => {
  return await Task.create(taskData);
};

const updateTask = async (id, updateData) => {
  return await Task.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
