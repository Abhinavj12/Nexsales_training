const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const {
  registerRoutes
} = require("./configs/route-config");

const errorHandler = require(
  "./middleware/error-handler"
);

const app = express();

app.use(helmet());

app.use(cors());

app.use(
  express.json({
    verify: (req, res, buf) => {
      if (
        req.originalUrl ===
        "/api/v1/payments/webhook"
      ) {
        req.rawBody = buf;
      }
    }
  })
);

registerRoutes(app);

app.use(errorHandler);

module.exports = app;