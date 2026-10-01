const { decode } = require("jsonwebtoken");
const {
    verifyAccessToken
} = require("../utils/jwt");

const authenticate = (req, res, next) => {
    try {
        const authorization =
            req.headers.authorization;

        //Authrization header ischecking
        if (!authorization) {
            const error = new Error(
                "Authentication token is required"
            );
            error.statusCode = 401;
            throw error;
        }
        //check bearer format
        const parts = authorization.split(" ");
        if (
            parts.length != 2 ||
            parts[0] !== "Bearer" ||
            !parts[1]
        ) {
            const error = new Error(
                "Invalid authorization header"
            );

            error.statusCode = 401;

            throw error;
        }
        //Verify JWT
        const decoded=verifyAccessToken(token);

        //Attaching authenticated user
        req.user={
            id:decoded.sub,
            role:decoded.role
        }
        next()

    } catch (error) {
        if (
      error.name === "TokenExpiredError"
    ) {
      error.statusCode = 401;
      error.message = "Access token has expired";
    }

    if (
      error.name === "JsonWebTokenError"
    ) {
      error.statusCode = 401;
      error.message = "Invalid access token";
    }

    next(error);

    }
};
module.exports = {
  authenticate
};