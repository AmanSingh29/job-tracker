const JobImportService = require("../services/importJobs.service");

exports.runImport = async (req, res, next) => {
  const feed_url = "https://jobicy.com/?feed=job_feed";
  const result = await JobImportService.importFromFeed(feed_url);
  res.data = result;
  next();
};
