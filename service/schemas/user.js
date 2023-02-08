const mongoose = require("mongoose");
const { Schema } = mongoose;
// const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamp: true }
);
// userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
