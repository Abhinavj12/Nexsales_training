import "dotenv/config";

import app from "./app.js";

import {
    closeDatabaseConnection
} from "./config/database.js";

const PORT = Number(
    process.env.PORT ?? 3000
);

const server = app.listen(
    PORT,
    () => {
        console.log(
            `Server running at http://localhost:${PORT}`
        );
    }
);

const shutdown = signal => {
    console.log(
        `\n${signal} received. Closing server...`
    );

    server.close(async error => {
        if (error) {
            console.error(
                "Error while closing server:",
                error
            );

            process.exit(1);
        }

        await closeDatabaseConnection();

        console.log(
            "Server and database connections closed"
        );

        process.exit(0);
    });
};

process.on(
    "SIGINT",
    () => shutdown("SIGINT")
);

process.on(
    "SIGTERM",
    () => shutdown("SIGTERM")
);