const webhookService =
  require("../services/payment-webhook-service");

const handleRazorpayWebhook =
  async (req, res) => {
    try {
      const signature =
        req.headers[
          "x-razorpay-signature"
        ];

      const eventId =
        req.headers[
          "x-razorpay-event-id"
        ];

      await webhookService.processWebhook({
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
  };

module.exports = {
  handleRazorpayWebhook
};