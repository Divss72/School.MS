const Notice = require('../models/Notice');

const getNotices = async () => {
  return await Notice.find({}).sort({ createdAt: -1 });
};

const createNotice = async (noticeData) => {
  return await Notice.create(noticeData);
};

const deleteNotice = async (id) => {
  return await Notice.findByIdAndDelete(id);
};

module.exports = { getNotices, createNotice, deleteNotice };
