require("dotenv").config({
  path: "../.env"
});

const {
  verifyMailTransporter
} = require("./app/services/mail-service");

const test = async () => {
  const result =
    await verifyMailTransporter();

  if (!result) {
    process.exit(1);
  }

  process.exit(0);
};

test();