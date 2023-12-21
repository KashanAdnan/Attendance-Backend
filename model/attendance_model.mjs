import mongoose from "mongoose";

const date = new Date();
const attendance_schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please EnterName"],
  },
  roll_id: {
    type: String,
    required: [true, "Please Enter Roll Id"],
  },
  picture: {
    type: String,
    required: [true, "Please Enter Picture"],
  },
  checkin: {
    type: String,
    default: "-----",
  },
  checkout: {
    type: String,
    default: "-----",
  },
  location: {
    type: String,
    required: [true, "Please Enter Location"],
  },
});

const attendance_model = mongoose.model("attendance", attendance_schema);

export { attendance_model };
