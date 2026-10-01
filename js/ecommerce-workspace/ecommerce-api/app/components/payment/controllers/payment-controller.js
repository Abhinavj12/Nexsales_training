const paymentService = require("../services/payment-service");
const {
  verifyPaymentSchema
} = require("../validations/payment-validation");

const createPayment = async (
  req,
  res,
  next
) => {
  try {
    const payment =
      await paymentService.createPayment(
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
};
const getMyPayment = async (
  req,
  res,
  next
) => {
  try {
    const payment =
      await paymentService.getMyPayment(
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
};
const verifyPayment = async (
  req,
  res,
  next
) => {
  try {
    const data =
      verifyPaymentSchema.parse(
        req.body
      );

    const payment =
      await paymentService.verifyPayment({
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
};

module.exports = {
  createPayment,
  getMyPayment,
  verifyPayment
};