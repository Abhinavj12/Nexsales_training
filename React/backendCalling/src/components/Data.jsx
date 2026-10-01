import React from "react";
import { readAllStudents } from "../services/studentService";

const Data = () => {

    const readData = async () => {
        const response = await readAllStudents();

        console.log(response);
    };

    return (
        <div>
            <button onClick={readData}>Read Data</button>
        </div>
    );
};

export default Data;