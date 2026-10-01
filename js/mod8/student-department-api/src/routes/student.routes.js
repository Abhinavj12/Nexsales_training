import express from "express";

import studentController from "../controllers/student.controller.js";

import validate from "../middlewares/validate.middleware.js";

import {
    createStudentSchema
} from "../validations/student.validation.js";

const router = express.Router();

router.post(
    "/",
    validate(createStudentSchema),
    studentController.create
);

router.get(
    "/",
    studentController.getAll
);

router.get(
    "/:id",
    studentController.getById
);

router.put(
    "/:id",
    studentController.update
);

router.delete(
    "/:id",
    studentController.delete
);

export default router;