import Student from "../models/student.model.js";
import { parseStudentId,validateUpdateData } from "../utils/studentValidation.js";
export const createStudent = async (req, res,next) => {
    try{
        
        validateStudentData(req.body);
        const { firstName, lastName, email, age } = req.body;
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
        // console.error("Error creating student:", error.message);
        // return res.status(500).json({
        //     success:false,
        //     message:"Failed to create student"
        // });
        next(error);
    }
}

export const getAllStudents=async (req, res,next) => {
    try{
        const students=await Student.findAll();
        return res.status(200).json({
            success:true,
            data:students
        });
    }catch(error){
        // cosnole.error("Error fetching students:", error.message);
        // return res.status(500).json({
        //     success:false,
        //     message:"Failed to fetch students"
        // });
         next(error);
    }
}
export const getStudentById=async (req, res,next) => {
    try{
        
        const studentId=parseStudentId(req.params.id);
        const student=await Student.findByPk(studentId);
        if(!student){
            res.status(404).json({
                success:false,
                message:"Student not found"
            });
        }
        return res.status(200).json({
            success:true,
            data:student
        });
    }catch(error){
        // console.error("Error fetching student:", error.message);
        // return res.status(500).json({
        //     success:false,
        //     message:"Failed to fetch student"
        // });
         next(error);
    }
}

export const updateStudent=async (req, res,next) => {
    try{
         validateStudentData(req.body);
         const studentId=parseStudentId(req.params.id);
         const student=await Student.findByPk(studentId);
         if(!student){
            return res.status(404).json({
                success:false,
                message:"Student not found"
            });
         }
         
         const { firstName, lastName, email, age } = req.body;
         const updates={};
        
         if(firstName!==undefined) updates.firstName=firstName;
         if(lastName!==undefined) updates.lastName=lastName;
         if(email!==undefined) updates.email=email;
         if(age!==undefined) updates.age=age;

         await student.update(updates);
         return res.status(200).json({
            success:true,
            message:"Student updated successfully",
            data:student
         });

    }catch(error){
        // console.error("Error updating student:", error.message);
        // return res.status(500).json({
        //     success:false,
        //     message:"Failed to update student"
        // });
        next(error);
    }
}
export const deleteStudent=async (req, res,next) => {
    try{
        const studentId=parseStudentId(req.params.id);
        const student=await Student.findByPk(studentId);
        if(!student){
            return res.status(404).json({
                success:false,
                message:"Student not found"
            });
        }
        await student.destroy();
        return res.status(200).json({
            success:true,
            message:"Student deleted successfully"
        });

    }catch{
        // console.error("Error deleting student:", error.message);
        // return res.status(500).json({
        //     success:false,
        //     message:"Failed to delete student"
        // });
        next(error);

    }
}
