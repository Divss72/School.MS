const express = require('express');
const router = express.Router();
const { getTimeTables, createOrUpdateTimeTable, deleteTimeTable } = require('../controllers/timetableController');
const { protect } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');

router.use(protect);

router.route('/')
  .get(getTimeTables)
  .post(adminOnly, createOrUpdateTimeTable);

router.route('/:id')
  .delete(adminOnly, deleteTimeTable);

module.exports = router;
