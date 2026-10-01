const {
  sequelize,
  User,
  EmailVerificationToken
} = require("./lib/db/models");

const test = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connection successful");

    console.log(
      "User model:",
      User ? "loaded" : "NOT loaded"
    );

    console.log(
      "EmailVerificationToken model:",
      EmailVerificationToken
        ? "loaded"
        : "NOT loaded"
    );

    console.log(
      "EmailVerificationToken table:",
      EmailVerificationToken.getTableName()
    );

    console.log(
      "User associations:",
      Object.keys(User.associations)
    );

    console.log(
      "EmailVerificationToken associations:",
      Object.keys(
        EmailVerificationToken.associations
      )
    );

    await sequelize.close();

    console.log("Model test successful");
  } catch (error) {
    console.error("Model test failed");
    console.error(error);

    process.exit(1);
  }
};

test();