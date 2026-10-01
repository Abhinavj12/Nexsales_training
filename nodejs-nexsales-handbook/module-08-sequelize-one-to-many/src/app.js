import express from "express";
import departmentRoutes from "./routes/department.routes.js";
import studentRoutes from "./routes/student.routes.js";

const app = express();

app.use(express.json());

app.get("/", (request, response) => {
    return response.status(200).json({
        message: "Student Department API is running."
    });
});

app.use("/api/departments", departmentRoutes);
app.use("/api/students", studentRoutes);

app.use((request, response) => {
    return response.status(404).json({ message: "Route not found." });
});

export default app;
