const mongoose = require("mongoose");

// Course schema
const CourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      minlength: [4, "Course name must be at least 4 characters long"],
      maxlength: [20, "Course name cannot exceed 20 characters"],
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Populate the properties with virtuals
CourseSchema.virtual("students", {
  ref: "User",
  foreignField: "course",
  localField: "_id",
  justOne: false,
});

// Course model
const Course = mongoose.model("Course", CourseSchema);

module.exports = { Course };
