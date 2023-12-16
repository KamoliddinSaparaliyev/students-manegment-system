const mongoose = require("mongoose");

// Grade schema
const GradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    result: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Result",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: 1000,
    },
    grade: {
      type: Number,
      required: [true, "Please add a grade"],
      max: [5, "Please add a maximum number of grade"],
      min: [1, "Please add a minimum number of grade"],
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
const Grade = mongoose.model("Grade", GradeSchema);

module.exports = { Grade };
