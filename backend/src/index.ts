import express, { Request, Response } from "express";
import cors from 'cors';
import mongoose from "mongoose";
import 'dotenv/config'

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => console.log('database connected'));


const app = express();

app.use(express.json());
app.use(cors());

app.get('/test', (req: Request, res: Response) => {
    res.json({ msg: "Testing route" });
})

app.listen(7000, () => {
    console.log('backend started on port 7000');
})