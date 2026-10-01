const ReportService =
  require("../services/report-service");


class ReportController {

  constructor() {
    // Report generation is handled by ReportService
    this.service =
      new ReportService();
  }


  async getOrderHistoryPdf(
    req,
    res,
    next
  ) {

    try {

      await this.service.generateOrderHistoryPdf(
        req.user.id,
        res
      );

    } catch (error) {
      next(error);
    }
  }


  async getOrderHistoryCsv(
    req,
    res,
    next
  ) {

    try {

      await this.service.generateOrderHistoryCsv(
        req.user.id,
        res
      );

    } catch (error) {
      next(error);
    }
  }


  async getAdminOrderHistoryPdf(
    req,
    res,
    next
  ) {

    try {

      await this.service.generateAdminOrderHistoryPdf(
        res
      );

    } catch (error) {
      next(error);
    }
  }


  async getAdminOrderHistoryCsv(
    req,
    res,
    next
  ) {

    try {

      await this.service.generateAdminOrderHistoryCsv(
        res
      );

    } catch (error) {
      next(error);
    }
  }
}


module.exports = ReportController;