const express = require('express');
const router = express.Router();
const { getResults, createResult, getStudentProgress } = require('../controllers/resultController');
const { protect } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');

router.use(protect);

router.route('/')
  .get(getResults)
  .post(adminOnly, createResult);

router.get('/progress/:studentId', adminOnly, getStudentProgress);

module.exports = router;
