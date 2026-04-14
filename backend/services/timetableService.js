const TimeTable = require('../models/TimeTable');

const getTimeTables = async (filter = {}) => {
  return await TimeTable.find(filter).sort({ day: 1 });
};

const createOrUpdateTimeTable = async (data) => {
  const { class: className, day, schedule } = data;
  return await TimeTable.findOneAndUpdate(
    { class: className, day },
    { schedule },
    { upsert: true, new: true }
  );
};

const deleteTimeTable = async (id) => {
  return await TimeTable.findByIdAndDelete(id);
};

module.exports = { getTimeTables, createOrUpdateTimeTable, deleteTimeTable };
