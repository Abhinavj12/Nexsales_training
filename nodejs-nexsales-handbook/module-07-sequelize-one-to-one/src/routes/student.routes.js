import {
    Router
} from "express";

import {
    createStudent,
    createStudentProfile,
    deleteStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    updateStudentProfile
} from "../controllers/student.controller.js";

const studentRouter = Router();

studentRouter.get(
    "/",
    getAllStudents
);

studentRouter.get(
    "/:id",
    getStudentById
);

studentRouter.post(
    "/",
    createStudent
);

studentRouter.post(
    "/:id/profile",
    createStudentProfile
);

studentRouter.patch(
    "/:id",
    updateStudent
);

studentRouter.patch(
    "/:id/profile",
    updateStudentProfile
);

studentRouter.delete(
    "/:id",
    deleteStudent
);

export default studentRouter;
