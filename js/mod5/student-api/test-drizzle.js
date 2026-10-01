import {sql} from "drizzle-orm";
import {db} from "./src/config/database.js";

try{
    const result=await db.execute(
        sql`SELECT 1 AS result`
    );
    console.log(result);
} catch(error){
    console.error("Error occurred while executing query:", error.message);
}