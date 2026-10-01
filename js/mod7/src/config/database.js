import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: "postgres",
        logging:process.env.SQL_LOGGING === "true" ? console.log : false
    }
);
export const connectDatabase = async () => {
    try{
        await sequelize.authenticate();
        console.log("postgres database connected successfully");
    }catch(error){
        console.error("Unable to connect to the database:", error.message);
        throw error;
    }
    
}
export const synchronizeDatabase = async () => {
    try{
        await sequelize.sync();
        console.log("Database synchronized successfully");
    }catch(error){
        console.error("Unable to synchronize the database:", error.message);
        throw error;
    }
  
}
export default sequelize;