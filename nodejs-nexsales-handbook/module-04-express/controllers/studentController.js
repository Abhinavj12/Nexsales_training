import students from '../data/students.js';

export const getAllStudents = (req,res)=>{
    const{firstName,lastName,dobFrom,dobTo} = req.query;

    let filteredStudents = students;

    if(firstName){
        filteredStudents = filteredStudents.filter((student)=>{
            return student.firstName.toLowerCase() === firstName.toLowerCase();
        })
    }

    if (lastName) {
        filteredStudents = filteredStudents.filter(
            (student) =>
                student.lastName.toLowerCase() === lastName.toLowerCase()
        );
    }

    if (dobFrom) {
        const fromDate = new Date(dobFrom);

        filteredStudents = filteredStudents.filter(
            (student) => new Date(student.dob) >= fromDate
        );
    }

    if (dobTo) {
        const toDate = new Date(dobTo);

        filteredStudents = filteredStudents.filter(
            (student) => new Date(student.dob) <= toDate
        );
    }

    res.status(200).json({
        count: filteredStudents.length,
        students: filteredStudents
    });
};

export const getStudentById = (req, res) => {
    const studentId = Number(req.params.id);

    const student = students.find(
        (student) => student.id === studentId
    );

    if (!student) {
        return res.status(404).json({
            message: `Student with ID ${studentId} not found`
        });
    }

    res.status(200).json(student);
};