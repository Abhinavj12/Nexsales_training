const { NotFoundError } = require("../lib/errors");
module.exports = (req, res, next) => next(new NotFoundError("API endpoint not found."));
