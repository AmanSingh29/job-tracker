const cron = require("node-cron");
const logger = require("../utils/logger.ut");
const JobImportService = require("../services/importJobs.service");
const { JOB_IMPORT_CRON_TIME } = require("../config/env");

let isRunning = false;
const cronTime = JOB_IMPORT_CRON_TIME || "0 * * * *";

cron.schedule(cronTime, async () => {
  if (isRunning) return;

  isRunning = true;
  logger.info("----import job cron started----");

  try {
    const feed_url = "https://jobicy.com/?feed=job_feed";
    await JobImportService.importFromFeed(feed_url);
    logger.info("----import job cron completed----");
  } catch (err) {
    logger.error("Import job failed", err);
  } finally {
    isRunning = false;
  }
});
