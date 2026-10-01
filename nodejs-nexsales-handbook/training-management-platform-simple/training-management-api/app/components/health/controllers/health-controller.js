class HealthController {
    async getHealth(req, res, next) {
        try {
            return res.status(200).json({ status: "ok" });
        } catch (error) {
            return next(error);
        }
    }
}
module.exports = HealthController;
