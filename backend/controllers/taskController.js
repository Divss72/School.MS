const asyncWrapper = require('../utils/asyncWrapper');
const { successResponse } = require('../utils/responseHelper');
const taskService = require('../services/taskService');

const getTasks = asyncWrapper(async (req, res) => {
  const tasks = await taskService.getTasks(req.user);
  return successResponse(res, tasks);
});

const createTask = asyncWrapper(async (req, res) => {
  const task = await taskService.createTask(req.body);
  return successResponse(res, task, 'Assignment created', 201);
});

const updateTask = asyncWrapper(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body);
  return successResponse(res, task, 'Assignment updated');
});

const deleteTask = asyncWrapper(async (req, res) => {
  await taskService.deleteTask(req.params.id);
  return successResponse(res, null, 'Assignment deleted');
});

module.exports = { getTasks, createTask, updateTask, deleteTask };
