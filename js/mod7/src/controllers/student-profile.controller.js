import { Student, StudentProfile } from "../models/index.js";

export const createStudentProfile = async (req, res) => {
    try {
        const studentId = Number(req.params.studentId);

        const {
            phone,
            address,
            dateOfBirth
        } = req.body;

        const student = await Student.findByPk(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const existingProfile = await StudentProfile.findOne({
            where: {
                studentId
            }
        });

        if (existingProfile) {
            return res.status(409).json({
                success: false,
                message: "Student profile already exists"
            });
        }

        const profile = await StudentProfile.create({
            studentId,
            phone,
            address,
            dateOfBirth
        });

        return res.status(201).json({
            success: true,
            message: "Student profile created successfully",
            data: profile
        });

    } catch (error) {
        console.error("Error creating student profile:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create student profile",
            error: error.message
        });
    }
};

export const getStudentProfile = async (req, res) => {
    try {
       // console.log("PARAMS:", req.params);

        const studentId = Number(req.params.studentId);

       // console.log("studentId:", studentId);

        const student = await Student.findByPk(studentId, {
            include: [
                {
                    model: StudentProfile,
                    as: "profile"
                }
            ]
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            data: student
        });

    } catch (error) {
        console.error("Error Fetching Student:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch student profile",
            error: error.message
        });
    }
};
export const updateStudentProfile = async (req, res) => {
    try {
        const studentId = Number(req.params.studentId);

        const {
            phone,
            address,
            dateOfBirth
        } = req.body;

        const profile = await StudentProfile.findOne({
            where: {
                studentId
            }
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        await profile.update({
            phone,
            address,
            dateOfBirth
        });

        return res.status(200).json({
            success: true,
            message: "Student profile updated successfully",
            data: profile
        });

    } catch (error) {
        console.error("Error updating student profile:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update student profile",
            error: error.message
        });
    }
};
export const deleteStudentProfile = async (req, res) => {
    try {
        const studentId = Number(req.params.studentId);

        const profile = await StudentProfile.findOne({
            where: {
                studentId
            }
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        await profile.destroy();

        return res.status(200).json({
            success: true,
            message: "Student profile deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting student profile:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete student profile",
            error: error.message
        });
    }
};