import student_controller from "../controller/student.controller.mjs";
import express from "express";
import authentication from "../middleware/authentication.mjs";
const student_route = express.Router();
import { upload } from "../utils/multer.mjs";

student_route.post(
  "/register",
  upload.single("image"),
  student_controller.create_student
);
student_route.post("/login", student_controller.login_student);
student_route.get("/logout", student_controller.logout);
student_route.post("/profile", student_controller.profile);
student_route.get("/students", student_controller.getAllStudents);
student_route.delete("/student/:id", student_controller.deleteStudent);
student_route.get("/student/:id", student_controller.getSingleStudents);
student_route.put(
  "/student/:id",
  upload.single("image"),
  student_controller.updateStudent
);

export { student_route };
