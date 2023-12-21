import { student_model } from "../model/student_model.mjs";
import { sendToken } from "../utils/send_token.mjs";
import jwt from "jsonwebtoken";
import config from "../config/config.mjs";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const create_student = async (req, res) => {
  const { name, roll_id, password, course_name } = req.body;
  const user = await student_model.findOne({ roll_id });
  if (!roll_id && !password) {
    res.status(400).json({ success: false, msg: "Enter credentials!" });
    return;
  }
  if (!roll_id) {
    res
      .status(400)
      .json({ success: false, msg: "Enter roll id to create student!" });
    return;
  }
  if (!password) {
    res
      .status(400)
      .json({ success: false, msg: "Enter password to create student!" });
    return;
  }
  if (!name) {
    res
      .status(400)
      .json({ success: false, msg: "Enter name to create student!" });
    return;
  }
  if (!course_name) {
    res
      .status(400)
      .json({ success: false, msg: "Enter course name to create student!" });
    return;
  }
  if (password < 6) {
    res.status(400).json({
      success: false,
      msg: "Password should'nt be less than 6 characters!",
    });
    return;
  }
  if (password > 9) {
    res.status(400).json({
      success: false,
      msg: "Password should'nt be greater than 9 characters!",
    });
    return;
  }
  if (user) {
    res.status(400).json({
      success: false,
      msg: "Roll id already exists!",
    });
    return;
  }
  const path = req.file.path;
  cloudinary.uploader.upload(path, async (error, data) => {
    if (error) {
      return res.json({
        message: "Could not upload image to cloud , try again",
      });
    }
    const User = await student_model.create({
      name,
      roll_id,
      password,
      picture: data.secure_url,
      course_name,
    });
    sendToken(User, 200, res);
    fs.unlinkSync(path);
  });
};

const login_student = async (req, res) => {
  try {
    const { roll_id, password } = req.body;

    if (!roll_id && !password) {
      res
        .status(400)
        .json({ success: false, msg: "Enter roll id & password to login!" });
      return;
    }
    if (!roll_id) {
      res.status(400).json({ success: false, msg: "Enter roll id to login!" });
      return;
    }
    if (!password) {
      res.status(400).json({ success: false, msg: "Enter password to login!" });
      return;
    }
    if (password < 6) {
      res.status(400).json({
        success: false,
        msg: "Password should'nt be less than 6 characters!",
      });
      return;
    }
    if (password > 9) {
      res.status(400).json({
        success: false,
        msg: "Password should'nt be greater than 9 characters!",
      });
      return;
    }
    // -----------------------------------------------------------
    const user = await student_model.findOne({ roll_id });
    if (!user) {
      res.status(400).json({ success: false, msg: "Invalid credentials!" });
      return;
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      res.status(400).json({ success: false, msg: "Invalid credentials!" });
      return;
    }
    if (user.role === "admin") {
      const token = user.getJWTToken();
      res
        .status(201)
        .json({ success: true, msg: "Admin portal opened!", user, token });
      return;
    }
    const token = user.getJWTToken();
    res
      .status(200)
      .json({ success: true, msg: "Student login successfull!", user, token });
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res, next) => {
  res.cookie("student_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    succes: true,
    message: "Logout Succesfully!",
  });
};

const profile = async (req, res) => {
  const { student_token } = req.body;
  if (!student_token) {
    res.status(400).json({
      succes: false,
      message: "No Token Here !",
    });
    return;
  }
  jwt.verify(student_token, config.JWTSecret, async function (err, decoded) {
    const User = await student_model.findOne({ _id: decoded.id });
    if (!User) {
      res.status(400).json({
        success: false,
        msg: "User Not Found !",
      });
      return;
    }
    res.status(200).json({
      succes: true,
      User,
    });
  });
};

const getAllStudents = async (req, res) => {
  const students = await student_model.find({});
  res.status(200).json(students);
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  await student_model.deleteOne({ _id: id });
  res.status(200).json({
    success: true,
    message: "Student deleted succesfully !",
  });
};

const updateStudent = async (req, res) => {
  const { name, roll_id, password, course_name } = req.body;
  const updateObj = {};
  if (name) {
    updateObj.name = name;
  }
  if (roll_id) {
    updateObj.roll_id = roll_id;
  }
  if (password) {
    updateObj.password = password;
  }
  if (course_name) {
    updateObj.course_name = course_name;
  }
  if (course_name) {
    updateObj.course_name = course_name;
  }
  if (req.file) {
    const path = req.file.path;
    cloudinary.uploader.upload(path, async (error, data) => {
      if (error) {
        return res.json({
          message: "Could not upload image to cloud , try again",
        });
      }
      const student = await student_model.findByIdAndUpdate(
        { _id: req.params.id },
        {
          ...updateObj,
          picture: data.secure_url,
        },
        { new: true }
      );
      if (!student) {
        res.status(404).send({
          message: `Student Not Found With ID : ${req.params.id}`,
        });
      }
      res.status(200).send({
        succes: true,
        student,
      });
      fs.unlinkSync(path);
    });
  } else {
    const student = await student_model.findByIdAndUpdate(
      { _id: req.params.id },
      {
        ...updateObj,
      },
      { new: true }
    );
    if (!student) {
      res.status(404).send({
        message: `Student Not Found With ID : ${req.params.id}`,
      });
    }
    res.status(200).send({
      succes: true,
      student,
    });
  }
};

const getSingleStudents = async (req, res) => {
  const student = await student_model.find({ _id: req.params.id });
  res.status(200).json({ student });
};

export default {
  create_student,
  login_student,
  logout,
  profile,
  getAllStudents,
  getSingleStudents,
  deleteStudent,
  updateStudent,
};
