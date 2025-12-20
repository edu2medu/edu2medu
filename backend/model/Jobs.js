const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    jobType: { 
      type: String, 
      enum: ["Full-Time", "Part-Time", "Contract", "Internship"], 
      required: true 
    },
    salary: { type: Number },
    jobDescription: { type: String, required: true },
    jobRequirements: { type: String, required: true },
    applicationDeadline: { type: Date, required: true },
    howToApply: { type: String, required: true },
  },
  { timestamps: true } // Adds createdAt & updatedAt fields
);

const Job = mongoose.model("Job", JobSchema);
module.exports = Job;
