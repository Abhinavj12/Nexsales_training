import express from "express";

import departmentController from "../controllers/department.controller.js";

import validate from "../middlewares/validate.middleware.js";

import {
    createDepartmentSchema
} from "../validations/department.validation.js";

const router = express.Router();

router.post(
    "/",
    validate(createDepartmentSchema),
    departmentController.create
);

router.get(
    "/",
    departmentController.getAll
);

router.get(
    "/:id",
    departmentController.getById
);

router.put(
    "/:id",
    departmentController.update
);

router.delete(
    "/:id",
    departmentController.delete
);

export default router;