const Job = require("../models/jobs.mo");
const ImportLog = require("../models/import_logs.mo");
const logger = require("../utils/logger.ut");

class ProcessJobService {
  async processJob(jobData, importLogId) {
    logger.info(`Processing job: ${jobData.job_id}`);

    try {
      const result = await Job.updateOne(
        { job_id: jobData.job_id },
        { $set: jobData },
        { upsert: true }
      );

      const isNew = result.upsertedCount > 0;
      const isUpdated = result.modifiedCount > 0;

      if (importLogId) {
        const updateFields = {};
        if (isNew) {
          updateFields.$inc = { new_jobs: 1, total_imported: 1 };
        } else if (isUpdated) {
          updateFields.$inc = { updated_jobs: 1, total_imported: 1 };
        }

        if (Object.keys(updateFields).length > 0) {
          await ImportLog.findByIdAndUpdate(importLogId, updateFields);
        }
      }

      logger.info(
        `Job ${jobData.job_id} processed successfully (${
          isNew ? "new" : isUpdated ? "updated" : "unchanged"
        })`
      );

      return {
        success: true,
        job_id: jobData.job_id,
        isNew,
        isUpdated,
      };
    } catch (error) {
      logger.error(`Failed to process job ${jobData.job_id}:`, error);

      if (importLogId) {
        await ImportLog.findByIdAndUpdate(importLogId, {
          $inc: { total_failed: 1 },
          $push: {
            failed_jobs: {
              $each: [
                {
                  jobData,
                  reason: `Processing error: ${error.message}`,
                },
              ],
              $slice: -100,
            },
          },
        });
      }
      throw error;
    }
  }
}

module.exports = new ProcessJobService();
