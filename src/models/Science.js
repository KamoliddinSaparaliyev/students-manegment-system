const mongoose = require("mongoose");

// Science schema
const ScienceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a science name"],
      trim: true,
      minlength: [4, "Science name must be at least 4 characters long"],
      maxlength: [200, "Science name cannot exceed 20 characters"],
    },
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

// Science model
const Science = mongoose.model("Science", ScienceSchema);

module.exports = { Science };
