import { Student } from "../models/index.js"
export const createStudent=async(req,res)=>{
    try{
        const {firstName,lastName,email,age}=req.body;
        const student=await Student.create({
            firstName,
            lastName,
            email,
            age
        });
        return res.status(201).json({
            success:true,
            message:"Student created successfully",
            data:student
        });
    }catch(error){
        console.log("Error Craeting Student",error.message);
        res.status(500).json({
             success: false,
             message: "Failed to create student",
             error: error.message
        });
    }
};
export const getStudents=async(req,res)=>{
    try{
        const students=await Student.findAll();
        return res.status(200).json({
            success:true,
            data:students
        });
    }catch(error){
        console.error("Error fetching students:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch students",
            error: error.message
           });
    }
};
export const getStudentById = async (req, res) => {
    try {
        const studentId = Number(req.params.id);

        const student = await Student.findByPk(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error("Error fetching student:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch student",
            error: error.message
        });
    }
};
export const updateStudent = async (req, res) => {
    try {
        const studentId = Number(req.params.id);

        const {
            firstName,
            lastName,
            email,
            age
        } = req.body;

        const student = await Student.findByPk(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        await student.update({
            firstName,
            lastName,
            email,
            age
        });

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: student
        });
    } catch (error) {
        console.error("Error updating student:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update student",
            error: error.message
        });
    }
};
export const deleteStudent = async (req, res) => {
    try {
        const studentId = Number(req.params.id);

        const student = await Student.findByPk(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        await student.destroy();

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting student:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete student",
            error: error.message
        });
    }
};