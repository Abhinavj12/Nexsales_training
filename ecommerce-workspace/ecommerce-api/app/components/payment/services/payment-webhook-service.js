const crypto = require("crypto");

const {
  sequelize,
  User,
  Payment,
  Order,
  PaymentWebhookEvent
} = require("@ecommerce/ecommerce-data-model");

const MailService =
  require("../../../services/mail-service");


class PaymentWebhookService {

  constructor() {

    // Email service dependency
    this.mailService =
      new MailService();
  }


  // ============================================================
  // VERIFY WEBHOOK SIGNATURE
  // ============================================================

  verifyWebhookSignature(
    rawBody,
    signature
  ) {

    if (!signature || !rawBody) {
      return false;
    }

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_WEBHOOK_SECRET
        )
        .update(rawBody)
        .digest("hex");


    if (
      expectedSignature.length !==
      signature.length
    ) {
      return false;
    }


    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  }


  // ============================================================
  // PROCESS WEBHOOK
  // ============================================================

  async processWebhook({
    rawBody,
    signature,
    eventId
  }) {

    // Verify signature before parsing
    const valid =
      this.verifyWebhookSignature(
        rawBody,
        signature
      );


    if (!valid) {

      const error = new Error(
        "Invalid Razorpay webhook signature"
      );

      error.statusCode = 400;

      throw error;
    }


    // Parse webhook body only after
    // signature verification
    const event =
      JSON.parse(
        rawBody.toString()
      );


    if (!eventId) {

      const error = new Error(
        "Missing Razorpay event ID"
      );

      error.statusCode = 400;

      throw error;
    }


    // Prevent duplicate webhook processing
    const existingEvent =
      await PaymentWebhookEvent.findOne({
        where: {
          event_id: eventId
        }
      });


    if (existingEvent) {

      return {
        duplicate: true
      };
    }


    // Handle supported events
    if (
      event.event ===
      "payment.captured"
    ) {

      await this.handlePaymentCaptured(
        event
      );
    }


    if (
      event.event ===
      "payment.failed"
    ) {

      await this.handlePaymentFailed(
        event
      );
    }


    // Save webhook event after
    // successful processing
    try {

      await PaymentWebhookEvent.create({
        event_id:
          eventId,

        event_type:
          event.event,

        processed_at:
          new Date()
      });

    } catch (error) {

      // Another request may have
      // already inserted the same event
      if (
        error.name ===
        "SequelizeUniqueConstraintError"
      ) {

        return {
          duplicate: true
        };
      }

      throw error;
    }


    return {
      duplicate: false,
      processed: true,
      event: event.event
    };
  }


  // ============================================================
  // HANDLE PAYMENT CAPTURED
  // ============================================================

  async handlePaymentCaptured(
    event
  ) {

    const paymentEntity =
      event.payload?.payment?.entity;


    if (!paymentEntity) {

      const error = new Error(
        "Invalid payment.captured payload"
      );

      error.statusCode = 400;

      throw error;
    }


    const razorpayPaymentId =
      paymentEntity.id;

    const razorpayOrderId =
      paymentEntity.order_id;


    const transaction =
      await sequelize.transaction();


    try {

      // Lock payment row
      const payment =
        await Payment.findOne({
          where: {
            razorpay_order_id:
              razorpayOrderId
          },

          transaction,

          lock:
            transaction.LOCK.UPDATE
        });


      if (!payment) {

        const error = new Error(
          "Payment record not found"
        );

        error.statusCode = 404;

        throw error;
      }


      // Don't process successful
      // payment again
      if (
        payment.status ===
        "SUCCESS"
      ) {

        await transaction.commit();

        return;
      }


      // Lock order row
      const order =
        await Order.findByPk(
          payment.order_id,
          {
            transaction,

            lock:
              transaction.LOCK.UPDATE
          }
        );


      if (!order) {

        const error = new Error(
          "Order not found"
        );

        error.statusCode = 404;

        throw error;
      }


      // Update payment
      payment.status =
        "SUCCESS";

      payment.razorpay_payment_id =
        razorpayPaymentId;


      await payment.save({
        transaction
      });


      // Successful payment confirms order
      if (
        order.status === "PENDING" ||
        order.status === "CONFIRMED"
      ) {

        order.status =
          "CONFIRMED";

        await order.save({
          transaction
        });
      }


      // Commit database changes
      await transaction.commit();


      // ========================================================
      // SEND PAYMENT SUCCESS EMAIL
      // ========================================================

      try {

        const user =
          await User.findByPk(
            payment.user_id,
            {
              attributes: [
                "first_name",
                "email"
              ]
            }
          );


        if (user) {

          await this.mailService
            .sendPaymentSuccessEmail({

              email:
                user.email,

              firstName:
                user.first_name,

              orderId:
                order.id,

              paymentId:
                razorpayPaymentId,

              amount:
                payment.amount
            });
        }

      } catch (emailError) {

        // Email failure should not
        // rollback successful payment
        console.error(
          "Payment success email failed:",
          emailError.message
        );
      }


    } catch (error) {

      if (!transaction.finished) {
        await transaction.rollback();
      }

      throw error;
    }
  }


  // ============================================================
  // HANDLE PAYMENT FAILED
  // ============================================================

  async handlePaymentFailed(
    event
  ) {

    const paymentEntity =
      event.payload?.payment?.entity;


    if (!paymentEntity) {

      const error = new Error(
        "Invalid payment.failed payload"
      );

      error.statusCode = 400;

      throw error;
    }


    const razorpayPaymentId =
      paymentEntity.id;

    const razorpayOrderId =
      paymentEntity.order_id;


    const payment =
      await Payment.findOne({
        where: {
          razorpay_order_id:
            razorpayOrderId
        }
      });


    if (!payment) {

      const error = new Error(
        "Payment record not found"
      );

      error.statusCode = 404;

      throw error;
    }


    // Never overwrite successful payment
    if (
      payment.status ===
      "SUCCESS"
    ) {
      return;
    }


    payment.status =
      "FAILED";

    payment.razorpay_payment_id =
      razorpayPaymentId;


    await payment.save();
  }
}


module.exports =
  PaymentWebhookService;