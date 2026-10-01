import express from "express";

import studentRoutes
    from "./routes/student.routes.js";

const app = express();

app.use(express.json());

app.get(
    "/health",
    (req, res) => {
        return res.status(200).json({
            success: true,
            message:
                "Student API is running"
        });
    }
);

app.use(
    "/api/students",
    studentRoutes
);

export default app;
