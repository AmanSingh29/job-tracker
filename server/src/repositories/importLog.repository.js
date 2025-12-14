const ImportLog = require("../models/import_logs.mo");

class ImportLogRepository {
  async getLogs({ page, limit, filters, sort }) {
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: filters },
      {
        $addFields: {
          failed_jobs_count: {
            $size: { $ifNull: ["$failed_jobs", []] },
          },
        },
      },

      { $sort: sort },

      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          total_fetched: 1,
          total_imported: 1,
          total_failed: 1,
          new_jobs: 1,
          updated_jobs: 1,
          started_at: 1,
          finished_at: 1,
          failed_jobs_count: 1,
          created_at: 1,
          updated_at: 1,
        },
      },
    ];

    return ImportLog.aggregate(pipeline);
  }

  async count(filters) {
    return ImportLog.countDocuments(filters);
  }
}

module.exports = new ImportLogRepository();
