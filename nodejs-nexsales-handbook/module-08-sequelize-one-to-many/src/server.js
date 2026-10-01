import "dotenv/config";
import app from "./app.js";
import {
    closeDatabaseConnection,
    connectDatabase,
    synchronizeDatabase
} from "./config/database.js";
import { loadRelationships } from "./models/index.js";

const port = Number(process.env.PORT) || 3000;
let server;
let isShuttingDown = false;

const shutdown = async (signal) => {
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;
    console.log(`${signal} received. Shutting down gracefully.`);

    if (server) {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }

    await closeDatabaseConnection();
};

const handleSignal = async (signal) => {
    try {
        await shutdown(signal);
        process.exit(0);
    } catch (error) {
        console.error("Graceful shutdown failed:", error);
        process.exit(1);
    }
};

const startServer = async () => {
    try {
        await connectDatabase();
        loadRelationships();
        await synchronizeDatabase();

        server = app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Application startup failed:", error);
        await closeDatabaseConnection().catch(() => {});
        process.exit(1);
    }
};

process.once("SIGINT", () => {
    handleSignal("SIGINT");
});

process.once("SIGTERM", () => {
    handleSignal("SIGTERM");
});

await startServer();
