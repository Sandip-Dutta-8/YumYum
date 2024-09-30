import express, { Request, Response } from "express";
import cors from 'cors';
import mongoose from "mongoose";
import 'dotenv/config'
import myUserRoute from "./routes/MyUserRoute";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => console.log('database connected'));


const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/my/user", myUserRoute);

app.listen(7000, () => {
    console.log('backend started on port 7000');
})