const mongoose = require("mongoose");

// Grade schema
const ResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    files: [
      {
        type: String,
      },
    ],
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: 1000,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

// Model
const Result = mongoose.model("Result", ResultSchema);

module.exports = { Result };
