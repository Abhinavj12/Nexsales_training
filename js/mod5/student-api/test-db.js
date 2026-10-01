import "dotenv/config";
import pg from "pg";
const { Client }=pg;

const client=new Client({
    connectionString:process.env.DATABASE_URL
});

try{
    await client.connect();
    console.log("Connected to the database successfully");
    const result=await client.query(
        `SELECT current_database(), current_user, NOW();`
    );
    console.log(result.rows);
    await client.end();
    console.log("Database connection closed");
} catch(error){
    console.error("Error occurred while connecting to the database:", error.message);
}
