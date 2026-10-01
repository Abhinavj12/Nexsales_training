const PaymentService =
  require("../services/payment-service");

const {
  verifyPaymentSchema
} = require("../validations/payment-validation");


class PaymentController {

  constructor() {
    // Payment business logic is handled by PaymentService
    this.service = new PaymentService();
  }


  async createPayment(
    req,
    res,
    next
  ) {

    try {

      const payment =
        await this.service.createPayment(
          req.user.id,
          req.params.orderId
        );

      return res.status(201).json({
        success: true,
        message:
          "Payment created successfully",
        data: payment
      });

    } catch (error) {
      next(error);
    }
  }


  async getMyPayment(
    req,
    res,
    next
  ) {

    try {

      const payment =
        await this.service.getMyPayment(
          req.user.id,
          req.params.orderId
        );

      return res.status(200).json({
        success: true,
        message:
          "Payment retrieved successfully",
        data: payment
      });

    } catch (error) {
      next(error);
    }
  }


  async verifyPayment(
    req,
    res,
    next
  ) {

    try {

      const data =
        verifyPaymentSchema.parse(
          req.body
        );

      const payment =
        await this.service.verifyPayment({
          userId: req.user.id,

          razorpayOrderId:
            data.razorpay_order_id,

          razorpayPaymentId:
            data.razorpay_payment_id,

          razorpaySignature:
            data.razorpay_signature
        });

      return res.status(200).json({
        success: true,
        message:
          "Payment verified successfully",
        data: payment
      });

    } catch (error) {
      next(error);
    }
  }
}


module.exports = PaymentController;