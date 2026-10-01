import axios from "axios";

const studentApi = axios.create({
    baseURL: "http://localhost:3000/api"
});

export default studentApi;