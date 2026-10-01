import students from "../data/student.js"

export const getAllStudents=(req,res)=>{
    // res.json({
    //     message:"Student route working in controller"
    // });
    res.json(students)
}
export const getAllStudentById=(req,res)=>{
    const studentId=Number(req.params.id);
    const student=students.find((student)=>{
        return student.id===studentId;
    })
    if(!student){
        return res.status(404).json({
            message:"Student not found"
        })
    };
    return res.status(200).json(student);
}
export const createStudent=(req,res)=>{
    console.log(req.body);
    const studentData=req.body;
    const id=students.length+1;

    const student={
        id,
        ...studentData
    }
    students.push(student);
     return     res.status(201).json(student);
}
export const updateStudent=(req,res)=>{
    const studentid=Number(req.params.id);
    const index=students.findIndex((s)=>{
        return s.id===studentid;
    })
    if(index==-1){
        res.status(404).json({
            message:"No such id is present"
        })
    }
    students[index]={
        id:studentid,
        ...req.body
    }
    return res.status(200).json(students[index]);

}
export const deleteStudent=(req,res)=>{
    const studentId=Number(req.params.id);
    const index=students.findIndex((s)=>{
        return studentId===s.id;
    })
    if(index==-1){
        return res.status(404).json({
            message:"Student Id is not Found"
        })
    };
    students.splice(index,1);
    return res.status(200).json({
        message:"Delet successfuly"
    });
}