const fs = require("fs");
const path = require("path");

const {
  getMiddleware
} = require("../middleware/middleware-config");

const loadRouteConfig = () => {
  const routeConfigPath = path.join(
    __dirname,
    "route.config.json"
  );

  const fileContent = fs.readFileSync(
    routeConfigPath,
    "utf-8"
  );

  return JSON.parse(fileContent);
};

const registerRoutes = (app) => {
  const routes = loadRouteConfig();

  routes.forEach((routeConfig) => {
    const controllerPath = path.resolve(
      __dirname,
      routeConfig.controller
    );

    const controller = require(controllerPath);

    const action = controller[routeConfig.action];

    if (typeof action !== "function") {
      throw new Error(
        `Controller action "${routeConfig.action}" not found in ${routeConfig.controller}`
      );
    }

    const middlewareList = getMiddleware(
        routeConfig.middlewareNameList
    );

    const method = routeConfig.method.toLowerCase();

    if (typeof app[method] !== "function") {
      throw new Error(
        `Unsupported HTTP method: ${routeConfig.method}`
      );
    }

    app[method](
      routeConfig.route,
      ...middlewareList,
      action
    );

    console.log(
      `Route registered: ${routeConfig.method.toUpperCase()} ${routeConfig.route}`
    );
  });
};

module.exports = {
  loadRouteConfig,
  registerRoutes
};