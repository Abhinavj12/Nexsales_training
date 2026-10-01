const validateJsonContentType = require(
  "./validate-json-content-type"
);

const authenticate = require(
  "./authenticate"
);

const authorize = require(
  "./authorize"
);

const uploadProductImage =
  require("./upload-product-image");

const middlewareMap = {
  validateJsonContentType,
  authenticate,
  authorize,
  uploadProductImage
};


const getMiddleware = (
  middlewareConfigList = []
) => {
  return middlewareConfigList.map(
    (middlewareConfig) => {
      // Support simple middleware name
      if (typeof middlewareConfig === "string") {
        const middleware =
          middlewareMap[middlewareConfig];

        if (!middleware) {
          throw new Error(
            `Middleware "${middlewareConfig}" is not registered`
          );
        }

        return middleware;
      }

      // Support middleware with arguments
      if (
        typeof middlewareConfig === "object" &&
        middlewareConfig !== null
      ) {
        const {
          name,
          args = []
        } = middlewareConfig;

        const middleware =
          middlewareMap[name];

        if (!middleware) {
          throw new Error(
            `Middleware "${name}" is not registered`
          );
        }

        return middleware(...args);
      }

      throw new Error(
        "Invalid middleware configuration"
      );
    }
  );
};

module.exports = {
  getMiddleware
};