const service = require("../services/importLog.service");

async function getImportHistoryOfJobs(req, res, next) {
  const result = await service.getLogs(req.query);
  res.data = result;
  next();
}

module.exports = {
  getImportHistoryOfJobs,
};
