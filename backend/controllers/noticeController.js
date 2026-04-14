const asyncWrapper = require('../utils/asyncWrapper');
const { successResponse } = require('../utils/responseHelper');
const noticeService = require('../services/noticeService');

const getNotices = asyncWrapper(async (req, res) => {
  const notices = await noticeService.getNotices();
  return successResponse(res, notices);
});

const createNotice = asyncWrapper(async (req, res) => {
  const notice = await noticeService.createNotice(req.body);
  return successResponse(res, notice, 'Notice posted', 201);
});

const deleteNotice = asyncWrapper(async (req, res) => {
  await noticeService.deleteNotice(req.params.id);
  return successResponse(res, null, 'Notice deleted');
});

module.exports = { getNotices, createNotice, deleteNotice };
