const express = require('express');
const router = express.Router();
const { getActivities, createActivity, enrollInActivity, getEnrollments } = require('../controllers/activityController');
const { protect } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');

router.use(protect);

router.route('/')
  .get(getActivities)
  .post(adminOnly, createActivity);

router.route('/enroll')
  .post(enrollInActivity)
  .get(getEnrollments);

module.exports = router;
