import express from "express";
import studentRoutes from "./routes/studentRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
const app=express();
app.use(express.json());

// app.get("/",(req,res)=>{
//     return res.status(200).json({
//         succes:"true",
//         message:"student API is running"
//     });
// });
app.use("/api/students",studentRoutes);

export default app;