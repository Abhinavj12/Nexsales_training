const parseStudentId = value => {
    const studentId = Number(value);

    if (
        !Number.isInteger(studentId) ||
        studentId <= 0
    ) {
        return null;
    }

    return studentId;
};

export default parseStudentId;
