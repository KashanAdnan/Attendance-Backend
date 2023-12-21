import mongoose from "mongoose";
import config from "../config/config.mjs";

mongoose.set("strictQuery", true);
const connectDataBase = () => {
  mongoose.connect(config.mongodb_uri).then((data) => {
    console.log(`MongoDB Connected With Server ${data.connection.host}`);
  });
};

export  { connectDataBase };
