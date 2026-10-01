import express from "express";

import studentRouter from "./routes/student.routes.js";

const app = express();

app.use(
    express.json()
);

app.get(
    "/health",
    (req, res) => {
        return res.status(200).json({
            success: true,
            message:
                "Sequelize one-to-one application is running"
        });
    }
);

app.use(
    "/api/students",
    studentRouter
);

app.use(
    (req, res) => {
        return res.status(404).json({
            success: false,
            message:
                `Route ${req.method} ${req.originalUrl} not found`
        });
    }
);

export default app;
