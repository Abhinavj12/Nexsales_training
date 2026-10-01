import { Router } from "express";
import { getAllStudents,getAllStudentById,createStudent,updateStudent,deleteStudent } from "../controllers/studentController.js";

const router=Router();
router.get("/",getAllStudents);
router.get("/:id",getAllStudentById);
router.post("/",createStudent);
router.put("/:id",updateStudent);
router.delete("/:id",deleteStudent)
export default router;