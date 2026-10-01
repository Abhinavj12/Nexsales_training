import express from "express";

import {
    createStudentProfile,getStudentProfile,updateStudentProfile,deleteStudentProfile
} from "../controllers/student-profile.controller.js";

const router = express.Router();

router.post(
    "/:studentId/profile",
    createStudentProfile
);
router.get("/:studentId/profile",getStudentProfile);
export default router;
router.put(
    "/:studentId/profile",
    updateStudentProfile
);
router.delete(
    "/:studentId/profile",
    deleteStudentProfile
);