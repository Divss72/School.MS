const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(adminOnly, createTask);

router.route('/:id')
  .put(updateTask)
  .delete(adminOnly, deleteTask);

module.exports = router;
