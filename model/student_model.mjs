import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.mjs";

const student_schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
  },
  roll_id: {
    type: String,
    required: [true, "Please Enter Email"],
  },
  picture: {
    type: String,
    required: [true, "Please Enter Picture"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Password"],
  },
  course_name: {
    type: String,
    required: [true, "Please Enter Course Name"],
  },
  check_in: {
    type: String,
    default: "-----",
  },
  check_out: {
    type: String,
    default: "-----",
  },
  role: {
    type: String,
    default: "student",
  },
});

student_schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

student_schema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, config.JWTSecret, {
    expiresIn: "5d",
  });
};

student_schema.methods.comparePassword = async function (EnteredPassword) {
  return await bcrypt.compare(EnteredPassword, this.password);
};
const student_model = mongoose.model("students", student_schema);

export { student_model };
