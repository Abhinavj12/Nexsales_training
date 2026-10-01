import express from "express";
import studentRoutes from "./routes/student.routes.js";
import studentProfileRoutes from "./routes/student-profile.routes.js";

const app=express();
app.use(express.json());
app.get("/health",(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Application is running"
    });
});
app.use("/api/students",studentRoutes);
app.use("/api/students", studentProfileRoutes);
export default app;