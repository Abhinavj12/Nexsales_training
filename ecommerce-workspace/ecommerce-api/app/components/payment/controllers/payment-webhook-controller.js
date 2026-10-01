const PaymentWebhookService =
  require("../services/payment-webhook-service");


class PaymentWebhookController {

  constructor() {
    // Webhook business logic is handled by the service
    this.service =
      new PaymentWebhookService();
  }


  async handleRazorpayWebhook(
    req,
    res
  ) {

    try {

      const signature =
        req.headers[
          "x-razorpay-signature"
        ];

      const eventId =
        req.headers[
          "x-razorpay-event-id"
        ];

      await this.service.processWebhook({
        rawBody: req.rawBody,
        signature,
        eventId
      });

      return res.status(200).json({
        success: true
      });

    } catch (error) {

      console.error(
        "Razorpay webhook error:",
        error
      );

      return res.status(
        error.statusCode || 500
      ).json({
        success: false,
        message: error.message
      });
    }
  }
}


module.exports =
  PaymentWebhookController;