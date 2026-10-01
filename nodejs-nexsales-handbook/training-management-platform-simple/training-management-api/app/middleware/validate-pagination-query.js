const { pagination } = require("../utils/validation");
module.exports = (req, res, next) => {
    try {
        pagination(req.query);
        return next();
    } catch (error) {
        return next(error);
    }
};
