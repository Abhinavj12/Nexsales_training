require("dotenv").config({
  path: "../.env"
});

const {
  sendVerificationEmail
} = require("./app/services/mail-service");

const test = async () => {
  try {
    await sendVerificationEmail({
      email: "jaiswalabhinav958@gmail.com",
      firstName: "Abhinav",
      verificationToken: "test-token-123"
    });

    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Verification email failed");
    console.error(error);
    process.exit(1);
  }
};

test();