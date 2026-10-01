import express from "express";

import studentRoutes
    from "./routes/studentRoutes.js";

import {
    notFoundHandler
} from "./middleware/notFoundHandler.js";

import {
    errorHandler
} from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message:
            "Student API is running"
    });
});

app.use(
    "/api/students",
    studentRoutes
);

app.get("/favicon.ico", (req, res) => {
    return res.status(204).end();
});

app.use(notFoundHandler);

app.use(errorHandler);

export default app;