const mongoose = require("mongoose");
const { Schema } = mongoose;

const ImportLogSchema = new Schema(
  {
    total_fetched: Number,
    total_imported: Number,
    total_failed: Number,
    new_jobs: Number,
    updated_jobs: Number,
    started_at: Date,
    finished_at: Date,
    failed_jobs: [{ jobData: Object, reason: String }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("import_logs", ImportLogSchema);
