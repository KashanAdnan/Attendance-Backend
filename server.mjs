import express from "express";
const app = express();
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { connectDataBase } from "./database/connection.mjs";
import { student_route } from "./routes/student_routes.mjs";
import { attendance_route } from "./routes/attendance_routes.mjs";
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: "*" }));
app.use("/api/v1", student_route);
app.use("/api/v1", attendance_route);

cloudinary.config({
  cloud_name: "dkm9huflw",
  api_key: "459957364119957",
  api_secret: "f-k_UHnz1NX5XM9Iq_Pev_hL8PY",
});
connectDataBase();

app.listen(process.env.PORT, () => {
  console.log(`listening on Port ${process.env.PORT}`);
});
