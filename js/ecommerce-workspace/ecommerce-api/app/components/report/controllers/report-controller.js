const reportService =
  require("../services/report-service");

const getOrderHistoryPdf = async (
  req,
  res,
  next
) => {
  try {
    await reportService.generateOrderHistoryPdf(
      req.user.id,
      res
    );
  } catch (error) {
    next(error);
  }
};

const getOrderHistoryCsv = async (
  req,
  res,
  next
) => {
  try {
    await reportService.generateOrderHistoryCsv(
      req.user.id,
      res
    );
  } catch (error) {
    next(error);
  }
};
const getAdminOrderHistoryPdf =
  async (req, res, next) => {
    try {
      await reportService.generateAdminOrderHistoryPdf(
        res
      );
    } catch (error) {
      next(error);
    }
  };

const getAdminOrderHistoryCsv =
  async (req, res, next) => {
    try {
      await reportService.generateAdminOrderHistoryCsv(
        res
      );
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getOrderHistoryPdf,
  getOrderHistoryCsv,
  getAdminOrderHistoryPdf,
  getAdminOrderHistoryCsv
};