const crypto = require("crypto");

const TOKEN_EXPIRY_MINUTES = 30;

const generateVerificationToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiresAt = new Date(
    Date.now() +
      TOKEN_EXPIRY_MINUTES * 60 * 1000
  );

  return {
    rawToken,
    tokenHash,
    expiresAt
  };
};

const hashVerificationToken = (rawToken) => {
  return crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
};

module.exports = {
  generateVerificationToken,
  hashVerificationToken
};