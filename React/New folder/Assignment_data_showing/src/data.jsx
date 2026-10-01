import axios from "axios";

export const readData = async (url) => {
    try {
        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        console.log("Error fetching data:", error);
        return [];
    }
};