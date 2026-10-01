import { Router } from 'express';

import {
    getAllStudents,
    getStudentById
} from '../controllers/studentController.js';

const router = Router();

router.get('/', getAllStudents);

router.get('/:id', getStudentById);

export default router;