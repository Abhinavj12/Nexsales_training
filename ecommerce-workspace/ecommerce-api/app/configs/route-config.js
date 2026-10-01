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

    const Controller =
      require(controllerPath);

    let controller;
    let action;

    /*
     * New company structure:
     *
     * class Controller {
     *   constructor() {
     *     this.service = new Service();
     *   }
     * }
     */
    if (
      typeof Controller === "function"
    ) {

      controller =
        new Controller();

      action =
        controller[routeConfig.action];

      // Bind class method to controller instance
      action =
        action.bind(controller);

    }

    /*
     * Old structure:
     *
     * module.exports = {
     *   getProfile,
     *   updateProfile
     * };
     *
     * This allows us to convert components
     * one at a time without breaking the
     * entire application.
     */
    else {

      controller = Controller;

      action =
        controller[routeConfig.action];
    }


    // Make sure the requested controller action exists
    if (typeof action !== "function") {

      throw new Error(
        `Controller action "${routeConfig.action}" not found in ${routeConfig.controller}`
      );
    }


    // Load middleware for this route
    const middlewareList =
      getMiddleware(
        routeConfig.middlewareNameList
      );


    const method =
      routeConfig.method.toLowerCase();


    // Check HTTP method
    if (
      typeof app[method] !== "function"
    ) {

      throw new Error(
        `Unsupported HTTP method: ${routeConfig.method}`
      );
    }


    // Register route with Express
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