import "dotenv/config";

import app from "./app.js";

import {
    connectDatabase,
    synchronizeDatabase
} from "./config/database.js";

import "./models/index.js";

const PORT = Number(
    process.env.PORT ?? 3001
);

const startServer = async () => {
    try {
        await connectDatabase();

        await synchronizeDatabase();

        app.listen(
            PORT,
            () => {
                console.log(
                    `Server running at http://localhost:${PORT}`
                );
            }
        );
    } catch (error) {
        console.error(
            "Failed to start application:",
            error
        );

        process.exit(1);
    }
};

startServer();
