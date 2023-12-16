const mongoose = require("mongoose");

// Science schema
const LessonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a lesson name"],
      trim: true,
      minlength: [4, "Lesson name must be at least 4 characters long"],
      maxlength: [200, "Lesson name cannot exceed 20 characters"],
    },
    description: {
      type: String,
      required: true,
    },
    files: [
      {
        type: String,
      },
    ],
    duration: {
      type: Number,
      required: true,
    },
    science: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Science",
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

// Science model
const Lesson = mongoose.model("Lesson", LessonSchema);

module.exports = { Lesson };
