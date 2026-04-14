const express = require('express');
const router = express.Router();
const { getNotices, createNotice, deleteNotice } = require('../controllers/noticeController');
const { protect } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');

router.use(protect);

router.route('/')
  .get(getNotices)
  .post(adminOnly, createNotice);

router.route('/:id')
  .delete(adminOnly, deleteNotice);

module.exports = router;
