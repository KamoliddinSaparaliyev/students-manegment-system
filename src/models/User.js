const crypto = require("crypto");
const mongoose = require("mongoose");
const { genSalt, hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { config } = require("../config/config");
const { geocoder } = require("../utils/geocoder");

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
    age: {
      type: Number,
      required: [true, "Please add a age"],
      validate: {
        validator: function (v) {
          return v.toString().length === 2;
        },
        message: "Please, enter a correct age!",
      },
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
      required: false,
      default: "Choose",
      enum: ["male", "female", "Choose"],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    address: {
      type: String,
      required: [true, "Please add a address"],
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
    isVerified: {
      type: Boolean,
      default: false,
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
  if (!this.isModified("password")) next();

  const salt = await genSalt(10);

  this.password = await hash(this.password, salt);
});

// Sign JWT token and return
UserSchema.methods.getSignedJwtToken = function () {
  return sign({ user: { id: this._id } }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

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

//Geocode & location field
UserSchema.pre("save", async function (next) {
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
});

const User = mongoose.model("User", UserSchema);
module.exports = { User };
