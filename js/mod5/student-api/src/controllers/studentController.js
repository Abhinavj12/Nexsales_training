import {getAllStudents,getStudentById,createStudent,updateStudent,deleteStudent} from "../repositories/studentRepository.js";
export const getStudents=async(req,res)=>{
    try{
        const students=await getAllStudents();
        res.status(200).json({
            success:true,
            data:students
    });
    } catch (error) {
        next(error);
    }
}

export const getStudById=async(req,res,next)=>{
    try{
        studentId=Number(req.params.id);
        const student=await getStudentById(studentId);
        if(!student){
            res.status(404).json({
                success:false,
                message:`Student with id ${studentId} not found`
            }); 
        }
        res.status(200).json({
            success:true,
            data:student
        }); 
    }catch(error){
        next(error);
    }
}

export const createStud=async(req,res,next)=>{
    try{
        const student=await createStudent(req.body);
        res.status(201).json({
            success:true,
            data:student
        });

    }catch(error){
        next(error);
    }
}

export const updateStud=async(req,res,next)=>{
    try{
        const studentId=Number(req.params.id);
        const student=await updateStudent(studentId,req.body);
        if(!student){
            res.status(404).json({  
                success:false,
                message:`Student with id ${studentId} not found`
            });
        }  
        res.status(200).json({
            success:true,
            data:student
        });
    }catch(error){
        next(error);
    }
}

export const deleteStud=async(req,res,next)=>{
    try{
        const studentId=Number(req.params.id);
        const student=await deleteStudent(studentId);
        if(!student){
            res.status(404).json({
                success:false,
                message:`Student with id ${studentId} not found`
            });
        } 
        res.status(200).json({
            success:true,
            data:student
        });
    }catch(error){
        next(error);
    }
}