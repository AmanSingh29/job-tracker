const Job = require("../models/jobs.mo");
const ImportLog = require("../models/import_logs.mo");
const logger = require("../utils/logger.ut");

async function processJob(jobData, importLogId) {
  logger.info(`Processing job: ${jobData.job_id}`);

  try {
    if (!jobData?.job_id) throw new Error("Can't get the Job ID");
    const result = await Job.updateOne(
      { job_id: jobData.job_id },
      { $set: jobData },
      { upsert: true }
    );
    const isNew = result.upsertedCount > 0;
    const isUpdated = result.modifiedCount > 0;

    logger.info(
      `Job ${jobData.job_id} processed successfully (${
        isNew ? "new" : isUpdated ? "updated" : "unchanged"
      })`
    );

    return {
      success: true,
      importLogId,
      job_id: jobData.job_id,
      isNew,
      isUpdated,
    };
  } catch (error) {
    const err = {
      importLogId,
      errorMessage: error.message,
      jobData,
    };
    throw err;
  }
}

async function updateLogOnSuccess(payload) {
  try {
    const { importLogId, isNew, isUpdated } = payload || {};
    const endTime = new Date();
    if (importLogId) {
      const updateFields = {};
      if (isNew) {
        updateFields.$inc = { new_jobs: 1, total_imported: 1 };
      } else if (isUpdated) {
        updateFields.$inc = { updated_jobs: 1, total_imported: 1 };
      }
      updateFields.$set = { finished_at: endTime };
      if (Object.keys(updateFields).length > 0) {
        await ImportLog.findByIdAndUpdate(importLogId, updateFields);
      }
    }
  } catch (error) {
    logger.error("ERR in updateLogOnSuccess", error);
  }
}

async function updateLogOnError(payload) {
  try {
    const { importLogId, errorMessage, jobData } = payload || {};
    const endTime = new Date();
    if (importLogId) {
      await ImportLog.findByIdAndUpdate(importLogId, {
        $inc: { total_failed: 1 },
        $set: { finished_at: endTime },
        $push: {
          failed_jobs: {
            $each: [
              {
                jobData,
                reason: `Processing error: ${errorMessage}`,
              },
            ],
            $slice: -100,
          },
        },
      });
    }
  } catch (error) {
    logger.error("ERR in updateLogOnError", error);
  }
}

module.exports = {
  processJob,
  updateLogOnSuccess,
  updateLogOnError,
};
