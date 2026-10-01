import { Router } from 'express';
import {createStudent,getAllStudents,getStudentById,updateStudent,deleteStudent} from '../controllers/student.controller.js';
const router = Router();
router.post('/', createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.patch('/:id', updateStudent);
router.delete('/:id', deleteStudent);
export default router;