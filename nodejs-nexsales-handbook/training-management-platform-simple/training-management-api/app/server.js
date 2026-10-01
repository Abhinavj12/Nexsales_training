const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const { sequelize } = require("@training/training-management-data-model-simple");
const app = require("./app");
const port = Number(process.env.PORT || 3000);
const start = async () => {
    try {
        await sequelize.authenticate();
        const server = app.listen(port, () =>
            console.log(`API listening on http://localhost:${port}`)
        );
        const shutdown = () =>
            server.close(async () => {
                await sequelize.close();
                process.exit(0);
            });
        process.once("SIGINT", shutdown);
        process.once("SIGTERM", shutdown);
        return server;
    } catch (error) {
        console.error("Startup failed:", error.message);
        process.exitCode = 1;
        return null;
    }
};
module.exports = { start };
