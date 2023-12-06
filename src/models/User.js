const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
      match: [
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/,
        "Please add a valid emil",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlenght: 6,
      select: false,
    },
    phoneNumber: {
      type: Number,
      unique: true,
      maxlength: 15,
      required: [true, "Please add a phone number"],
    },
    role: {
      type: String,
      enum: ["student", "teacher", "assistance", "customer"],
      default: "student",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = { User };
