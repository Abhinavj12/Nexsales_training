const crypto = require("crypto");

const generatePasswordResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiresAt = new Date(
    Date.now() + 30 * 60 * 1000
  );

  return {
    rawToken,
    tokenHash,
    expiresAt
  };
};

const hashPasswordResetToken = (rawToken) => {
  return crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
};

module.exports = {
  generatePasswordResetToken,
  hashPasswordResetToken
};