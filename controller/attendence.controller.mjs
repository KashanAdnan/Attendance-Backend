import { attendance_model } from "../model/attendance_model.mjs";
import { student_model } from "../model/student_model.mjs";
import { v2 as cloudinary } from "cloudinary";

const create_attendance = async (req, res) => {
  const date = new Date();
  const { name, roll_id, location } = req.body;
  const path = req.file.path;
  cloudinary.uploader.upload(path, async (error, data) => {
    if (error) {
      return res.json({
        message: "Could not upload image to cloud , try again",
      });
    }
    const attendance = await student_model.findOne({ roll_id });
    if (!attendance) {
      res.status(400).json({
        success: false,
        message: "Wrong Roll Id !",
      });
      return;
    }
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    const User = await attendance_model.create({
      roll_id,
      name,
      picture: data.secure_url,
      location,
      checkin:
        date.getDate() +
        "-" +
        date.getMonth() +
        "-" +
        date.getFullYear() +
        " " +
        strTime,
    });
    await student_model.updateOne(
      { _id: attendance._id },
      {
        check_in:
          date.getDate() +
          "-" +
          date.getMonth() +
          "-" +
          date.getFullYear() +
          " " +
          strTime,
      }
    );
    res.json({
      success: false,
      message: "Your attendance has mark for today !",
      User,
    });
  });
};

const checkout = async (req, res) => {
  const { roll_id, id } = req.body;
  const attendance = await attendance_model.findOne({ _id: id });
  const date = new Date();
  const student = await student_model.findOne({ roll_id });
  if (!attendance) {
    res.status(400).json({
      success: false,
      message: "Wrong Roll Id !",
    });
    return;
  }
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  await student_model.updateOne(
    { _id: student._id },
    {
      check_out:
        date.getDate() +
        "-" +
        date.getMonth() +
        "-" +
        date.getFullYear() +
        " " +
        strTime,
    }
  );
  await attendance_model.findByIdAndUpdate(
    { _id: attendance._id },
    {
      checkout:
        date.getDate() +
        "-" +
        date.getMonth() +
        "-" +
        date.getFullYear() +
        " " +
        strTime,
    }
  );
  res.json({
    success: false,
    message: "Your attendance has mark for today !",
  });
};

const getAllAttendance = async (req, res) => {
  const students = (await attendance_model.find({})).reverse();
  res.status(200).json(students);
};

export default {
  create_attendance,
  getAllAttendance,
  checkout,
};
