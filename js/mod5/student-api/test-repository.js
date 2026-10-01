import {getAllStudents,getStudentById,createStudent,updateStudent,deleteStudent} from "./src/repositories/studentRepository.js";

try{
    const result1=await getAllStudents();
    console.log("Students:", result1[0]);

    // const result2=await getStudentById(1);
    // console.log("Student with id 1:", result2);

    // const newStudent=await createStudent({
    //      firstName: "Abhinav",
    //     lastName: "Jaiswal",
    //     email: "abhinav@gmail.com",
    //     age: 22,
    //     course: "Computer Engineering"
    // });
    // console.log("Newly created student:", newStudent);  
    // const updatedStudent=await updateStudent(1,{
    //     age: 23
    // });
    // console.log("Updated student with id 1:", updatedStudent);
    // const deletedStudent=await deleteStudent(1);
    // console.log("Deleted student with id 1:", deletedStudent);

}catch(error){
    console.error("Error occurred while fetching students:", error.message);
}

