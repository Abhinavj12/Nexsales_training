import express from "express";

import departmentRoutes from "./routes/department.routes.js";
import studentRoutes from "./routes/student.routes.js";

import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Student Department API is running"
    });
});

app.use(
    "/api/departments",
    departmentRoutes
);

app.use(
    "/api/students",
    studentRoutes
);

app.use(errorMiddleware);

export default app;