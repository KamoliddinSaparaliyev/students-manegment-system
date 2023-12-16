const mongoose = require("mongoose");

// Task schema
const TaskSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    files: [
      {
        type: String,
      },
    ],
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deadline: {
      type: Date,
      required: [true, "Please add an expire date"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: 1000,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
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
const Task = mongoose.model("Task", TaskSchema);

module.exports = { Task };
