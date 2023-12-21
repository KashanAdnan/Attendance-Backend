import attendance_controller from "../controller/attendence.controller.mjs";
import authentication from "../middleware/authentication.mjs";
import express from "express";

const attendance_route = express.Router();
import { upload } from "../utils/multer.mjs";

attendance_route.post(
  "/checkin",
  upload.single("image"),
  attendance_controller.create_attendance
);
attendance_route.get(
  "/attendances",
  attendance_controller.getAllAttendance
);
attendance_route.post("/checkout", attendance_controller.checkout);

export { attendance_route };
