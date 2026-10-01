import studentApi from "../api/studentApi";

export const readAllStudents = async () => {
    try {
        const response = await studentApi.get("/students");

        return response.data;
    } catch (error) {
        console.log(error);
    }
};