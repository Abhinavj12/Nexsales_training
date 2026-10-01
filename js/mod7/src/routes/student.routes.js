import express from "express";
import { createStudent, deleteStudent, getStudentById, getStudents, updateStudent } from "../controllers/student.controller.js";

const router=express.Router();
router.post("/",createStudent);
router.get("/",getStudents);
router.get("/:id",getStudentById)
router.patch("/:id",updateStudent);
router.delete("/:id",deleteStudent)
export default router;