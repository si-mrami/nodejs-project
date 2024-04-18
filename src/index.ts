import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookiePARSER from "cookie-parser";
import http from "http";
import compression from "compression";
import mongoose from "mongoose";
import dotenv from "dotenv";
import appRouter from "./Routers/User";

dotenv.config();
const app = express();
app.use(
  cors({
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookiePARSER());
app.use(compression());

// Connect to MongoDB
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log("MongoDB connected!");
    });
  } catch (error) {
    console.error("error connection in db ", error);
  }
};

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

// Routes
app.use("/api", appRouter);
// server rouning
server.listen(PORT, () => {
  connectDb();
  console.log(`Server running on port ${PORT}`);
});
