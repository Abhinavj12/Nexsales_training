const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      sub: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h"
    }
  );
};

const verifyAccessToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.verify(
    token,
    process.env.JWT_SECRET
  );
};

module.exports = {
  generateAccessToken,
  verifyAccessToken
};