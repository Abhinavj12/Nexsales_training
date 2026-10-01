import app from "./app.js";
import "dotenv/config.js";
import { connectDatabase, synchronizeDatabase } from "./config/database.js";
import "./models/student.model.js";

const port = Number(process.env.PORT) || 3000;

const startServer = async () => {
    try {
        await connectDatabase();
        await synchronizeDatabase();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error(
            "Application failed to start:",
            error.message
        );
        process.exit(1);
    }
}
await startServer();

