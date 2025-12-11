const mongoose = require("mongoose");
const { Schema } = mongoose;

const JobSchema = new Schema(
  {
    job_id: { type: String, index: true, unique: true },
    title: { type: String, required: true },
    company: { type: String, index: true },
    location: { type: String, index: true },
    type: { type: String, index: true },
    description: { type: String },
    link: { type: String },
    published_at: { type: Date, index: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

JobSchema.index(
  {
    title: "text",
    description: "text",
    company: "text",
  },
  {
    name: "job_text_index",
    weights: { title: 10, company: 5, description: 2 },
  }
);

module.exports = mongoose.model("jobs", JobSchema);
