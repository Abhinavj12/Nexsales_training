import "dotenv/config";
import app from "./app.js";
import sequelize from "./config/database.js";

// import "./models/department.model.js";
// import "./models/student.model.js";
import "./models/index.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();

        console.log("Database connected successfully");

        await sequelize.sync();

        console.log("Database synchronized successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Application startup failed:", error.message);
        process.exit(1);
    }
};

startServer();