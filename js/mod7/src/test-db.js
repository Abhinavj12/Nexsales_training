import { connectDatabase } from "./config/database.js";

const testDatbase=async()=>{
    try{
        await connectDatabase();
        console.log("Database test completed");
    }catch(error){
        console.log("Database Test Failed")
    }
};
testDatbase();