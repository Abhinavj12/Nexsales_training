const crypto = require("crypto");

const {
  sequelize,
  User,
  Payment,
  Order,
  PaymentWebhookEvent
} = require("@ecommerce/ecommerce-data-model");
const {
  sendPaymentSuccessEmail
} = require("../../../services/mail-service");

const verifyWebhookSignature = (
  rawBody,
  signature
) => {
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
};

const processWebhook = async ({
  rawBody,
  signature,
  eventId
}) => {
  // 1. Verify Razorpay signature
  const valid =
    verifyWebhookSignature(
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

  // 2. Parse only after signature verification
  const event =
    JSON.parse(rawBody.toString());

  // 3. Event ID is required
  if (!eventId) {
    const error = new Error(
      "Missing Razorpay event ID"
    );

    error.statusCode = 400;

    throw error;
  }

  // 4. Check duplicate event
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

  // 5. Process supported events
  if (
    event.event ===
    "payment.captured"
  ) {
    await handlePaymentCaptured(event);
  }

  if (
    event.event ===
    "payment.failed"
  ) {
    await handlePaymentFailed(event);
  }

  // 6. Record event only after successful processing
  try {
    await PaymentWebhookEvent.create({
      event_id: eventId,
      event_type: event.event,
      processed_at: new Date()
    });
  } catch (error) {
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
};

const handlePaymentCaptured =
  async (event) => {
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

      // Already successful
      if (
        payment.status ===
        "SUCCESS"
      ) {
        await transaction.commit();
        return;
      }

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
      payment.status = "SUCCESS";

      payment.razorpay_payment_id =
        razorpayPaymentId;

      await payment.save({
        transaction
      });

      // Update order
      if (
        order.status === "PENDING" ||
        order.status === "CONFIRMED"
      ) {
        order.status = "CONFIRMED";

        await order.save({
          transaction
        });
      }

      await transaction.commit();
      try {
  const user = await User.findByPk(
    payment.user_id,
    {
      attributes: [
        "first_name",
        "email"
      ]
    }
  );

  if (user) {
    await sendPaymentSuccessEmail({
      email: user.email,
      firstName: user.first_name,
      orderId: order.id,
      paymentId: razorpayPaymentId,
      amount: payment.amount
    });
  }
} catch (emailError) {
  console.error(
    "Payment success email failed:",
    emailError
  );
}
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

const handlePaymentFailed =
  async (event) => {
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
      payment.status === "SUCCESS"
    ) {
      return;
    }

    payment.status = "FAILED";

    payment.razorpay_payment_id =
      razorpayPaymentId;

    await payment.save();
  };

module.exports = {
  processWebhook,
  verifyWebhookSignature
};