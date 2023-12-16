const mongoose = require("mongoose");

// Group schema
const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      minlength: [4, "Group name must be at least 4 characters long"],
      maxlength: [20, "Group name cannot exceed 20 characters"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
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
GroupSchema.virtual("students", {
  ref: "User",
  foreignField: "group",
  localField: "_id",
  justOne: false,
});

// Group model
const Group = mongoose.model("Group", GroupSchema);

module.exports = { Group };
