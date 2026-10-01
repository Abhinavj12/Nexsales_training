import { Router } from "express";
import {
    createDepartment,
    deleteDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment
} from "../controllers/department.controller.js";

const router = Router();

router.post("/", createDepartment);
router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);
router.patch("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;
