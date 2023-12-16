const crypto = require("crypto");
const mongoose = require("mongoose");
const { genSalt, hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { config } = require("../config/config");
const { geocoder } = require("../utils/geocoder");

const StuffSchema = new mongoose.Schema({
  lastLoginTime: {
    type: Date,
    default: null,
  },
  position: {
    type: String,
    required: [true, "Please enter a position"],
    maxlength: [200, "Please enter a maximum of 200 characters"],
  },
  department: {
    type: String,
    required: [true, "Please enter a department"],
    maxlength: [200, "Please enter a maximum of 200 characters"],
  },
});

const StudentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Please add a course"],
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: [true, "Please add a group"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      maxlength: 100,
    },
    username: {
      type: String,
      required: [true, "Please provide a username"],
      lowercase: true,
      unique: true,
      trim: true,
      minlength: [4, "Username must be at least 4 characters long"],
      maxlength: [20, "Username cannot exceed 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    phoneNumber: {
      type: Number,
      unique: true,
      required: [true, "Please add a phone number"],
    },
    bornDate: {
      type: Date,
      required: [true, "Please add an time of birth"],
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
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
    role: {
      type: String,
      enum: ["student", "teacher", "assistance", "customer"],
      default: "student",
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    student: {
      type: StudentSchema,
      validate: function () {
        return this.role === "student";
      },
    },
    staff: {
      type: StuffSchema,
      required: function () {
        return this.role !== "student";
      },
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

// Hashing password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

// Assuming UserSchema is defined correctly...
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set resetPasswordToken field on the instance
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the expiration time for the reset token
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

  // Save the changes made to the user document
  this.save({ validateBeforeSave: false });

  return resetToken;
};

// Sign JWT token and return
UserSchema.methods.getSignedJwtToken = function () {
  return sign({ user: { id: this._id } }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

// Geocode & location field
UserSchema.pre("save", async function (next) {
  if (!this.isModified("address")) return next();

  try {
    const loc = await geocoder.geocode(this.address);
    this.location = {
      type: "Point",
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
      street: loc[0].streetName,
      city: loc[0].city,
      state: loc[0].stateCode,
      zipcode: loc[0].zipcode,
      country: loc[0].countryCode,
    };
    this.address = undefined;
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = { User };
