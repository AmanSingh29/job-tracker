const { importJobsFromFeed } = require("../services/importJobs.service");

exports.runImport = async (req, res, next) => {
  const result = await importJobsFromFeed("https://jobicy.com/?feed=job_feed");
  res.data = result;
  next();
};
