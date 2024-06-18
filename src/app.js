import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { API_SIZE_LIMIT } from "./constants.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: API_SIZE_LIMIT }));

//this is for url params e.g %
app.use(express.urlencoded({ extended: true, limit: API_SIZE_LIMIT }));

//this is to store static files on server
app.use(express.static("public"));

app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js"

//route declaration
app.use("/api/v1/user",userRouter);
export default app;
