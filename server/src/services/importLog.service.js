const repo = require("../repositories/importLog.repository");

class ImportLogService {
  async getLogs(query) {
    const { start_date, end_date, status, sort_by, sort_order } = query || {};
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const filters = {};

    if (start_date || end_date) {
      filters.created_at = {};
      if (start_date) {
        filters.created_at.$gte = new Date(start_date);
      }
      if (end_date) {
        filters.created_at.$lte = new Date(end_date);
      }
    }

    if (status) {
      if (status === "success") {
        filters.failed_jobs = { $size: 0 };
      }

      if (status === "failed") {
        filters.failed_jobs = { $exists: true, $not: { $size: 0 } };
      }
    }

    const sort = {};
    const sortField = sort_by || "created_at";
    const sortOrder = sort_order === "ascending" ? 1 : -1;
    sort[sortField] = sortOrder;

    const data = await repo.getLogs({ page, limit, filters, sort });
    const total = await repo.count(filters);

    return {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
      data,
    };
  }
}

module.exports = new ImportLogService();
