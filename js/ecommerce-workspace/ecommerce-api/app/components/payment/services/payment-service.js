const crypto = require("crypto");
const {
  sequelize,
  Payment,
  Order,
  User
} = require("@ecommerce/ecommerce-data-model");


const {
  createRazorpayOrder
} = require("../../../services/razorpay-service");

const {
  sendPaymentSuccessEmail
} = require("../../../services/mail-service");
const createPayment = async (
  userId,
  orderId
) => {
  // 1. Find the user's order
  const order = await Order.findOne({
    where: {
      id: orderId,
      user_id: userId
    }
  });

  if (!order) {
    const error = new Error(
      "Order not found"
    );

    error.statusCode = 404;

    throw error;
  }

  // 2. Only PENDING orders can start payment
  if (order.status !== "PENDING") {
    const error = new Error(
      `Payment cannot be created for an order with status ${order.status}`
    );

    error.statusCode = 409;

    throw error;
  }

  // 3. Don't create duplicate payment
  const existingPayment =
    await Payment.findOne({
      where: {
        order_id: order.id
      }
    });

  if (existingPayment) {
    const error = new Error(
      "Payment already exists for this order"
    );

    error.statusCode = 409;

    throw error;
  }

  // 4. Convert rupees to paise
  const amountInPaise = Math.round(
    Number(order.total_amount) * 100
  );

  if (amountInPaise < 100) {
    const error = new Error(
      "Payment amount must be at least ₹1"
    );

    error.statusCode = 400;

    throw error;
  }

  // 5. Create Razorpay Order
  const razorpayOrder =
    await createRazorpayOrder({
      amount: amountInPaise,

      receipt:
        `order_${order.id}`,

      notes: {
        internal_order_id:
          order.id,

        user_id:
          userId
      }
    });

  // 6. Create our Payment record
  const payment =
    await Payment.create({
      user_id: userId,

      order_id: order.id,

      amount:
        order.total_amount,

      status: "PENDING",

      razorpay_order_id:
        razorpayOrder.id
    });

  // 7. Return payment information
  return {
    payment: {
      id: payment.id,

      order_id:
        payment.order_id,

      amount:
        payment.amount,

      status:
        payment.status,

      razorpay_order_id:
        payment.razorpay_order_id
    },

    razorpay: {
      key_id:
        process.env.RAZORPAY_KEY_ID,

      order_id:
        razorpayOrder.id,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency
    }
  };
};


const processPaymentResult = async ({
  paymentId,
  gatewayReference,
  success
}) => {
  const transaction =
    await sequelize.transaction();

  try {
    const payment =
      await Payment.findByPk(
        paymentId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE
        }
      );

    if (!payment) {
      const error = new Error(
        "Payment not found"
      );

      error.statusCode = 404;

      throw error;
    }

    const order =
      await Order.findByPk(
        payment.order_id,
        {
          transaction,
          lock: transaction.LOCK.UPDATE
        }
      );

    if (!order) {
      const error = new Error(
        "Order not found"
      );

      error.statusCode = 404;

      throw error;
    }

    // Don't process an already completed payment.
    if (
      payment.status === "SUCCESS"
    ) {
      await transaction.commit();

      return payment;
    }

    if (success) {
      payment.status = "SUCCESS";

      payment.gateway_reference =
        gatewayReference;

      await payment.save({
        transaction
      });

      // Payment successful → order confirmed
      if (
        order.status === "PENDING" ||
        order.status === "CONFIRMED"
      ) {
        order.status = "CONFIRMED";

        await order.save({
          transaction
        });
      }
    } else {
      payment.status = "FAILED";

      payment.gateway_reference =
        gatewayReference;

      await payment.save({
        transaction
      });
    }

    await transaction.commit();

    return payment;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};
const getMyPayment = async (
  userId,
  orderId
) => {
  const payment =
    await Payment.findOne({
      where: {
        user_id: userId,
        order_id: orderId
      },

      attributes: [
        "id",
        "user_id",
        "order_id",
        "amount",
        "status",
        "gateway_reference",
        "createdAt",
        "updatedAt"
      ]
    });

  if (!payment) {
    const error = new Error(
      "Payment not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return payment;
};
const verifyPayment = async ({
  userId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
}) => {
  // 1. Find payment
  const payment = await Payment.findOne({
    where: {
      user_id: userId,
      razorpay_order_id: razorpayOrderId
    }
  });

  if (!payment) {
    const error = new Error(
      "Payment not found"
    );

    error.statusCode = 404;

    throw error;
  }

  // 2. Payment already verified
  if (payment.status === "SUCCESS") {
    return payment;
  }

  // 3. Use the Razorpay Order ID
  // stored in our database
  const serverRazorpayOrderId =
    payment.razorpay_order_id;

  // 4. Create signature payload
  const hmacInput =
    `${serverRazorpayOrderId}|${razorpayPaymentId}`;

  // 5. Generate expected signature
  const generatedSignature =
    crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(hmacInput)
      .digest("hex");

  // 6. Validate signature length
  if (
    typeof razorpaySignature !== "string" ||
    generatedSignature.length !==
      razorpaySignature.length
  ) {
    const error = new Error(
      "Invalid payment signature"
    );

    error.statusCode = 400;

    throw error;
  }

  // 7. Securely compare signatures
  const signatureIsValid =
    crypto.timingSafeEqual(
      Buffer.from(
        generatedSignature,
        "utf8"
      ),
      Buffer.from(
        razorpaySignature,
        "utf8"
      )
    );

  if (!signatureIsValid) {
    const error = new Error(
      "Invalid payment signature"
    );

    error.statusCode = 400;

    throw error;
  }

  // 8. Start transaction
  const transaction =
    await sequelize.transaction();

  try {
    // 9. Lock payment row
    const lockedPayment =
      await Payment.findByPk(
        payment.id,
        {
          transaction,
          lock: transaction.LOCK.UPDATE
        }
      );

    if (!lockedPayment) {
      const error = new Error(
        "Payment not found"
      );

      error.statusCode = 404;

      throw error;
    }

    // 10. Prevent duplicate processing
    if (
      lockedPayment.status === "SUCCESS"
    ) {
      await transaction.commit();

      return lockedPayment;
    }

    // 11. Lock order row
    const order =
      await Order.findByPk(
        lockedPayment.order_id,
        {
          transaction,
          lock: transaction.LOCK.UPDATE
        }
      );

    if (!order) {
      const error = new Error(
        "Order not found"
      );

      error.statusCode = 404;

      throw error;
    }

    // 12. Don't verify cancelled orders
    if (order.status === "CANCELLED") {
      const error = new Error(
        "Payment cannot be verified for a cancelled order"
      );

      error.statusCode = 409;

      throw error;
    }

    // 13. Save Razorpay payment details
    lockedPayment.razorpay_payment_id =
      razorpayPaymentId;

    lockedPayment.razorpay_signature =
      razorpaySignature;

    lockedPayment.status = "SUCCESS";

    await lockedPayment.save({
      transaction
    });

    // 14. Successful payment confirms order
    if (order.status === "PENDING") {
      order.status = "CONFIRMED";

      await order.save({
        transaction
      });
    }

    // 15. Commit transaction
    await transaction.commit();

    // Send payment success email AFTER DB commit
try {
  const user = await User.findByPk(
    userId,
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
      amount: lockedPayment.amount
    });
  }
} catch (emailError) {
  console.error(
    "Payment success email failed:",
    emailError.message
  );
}

    return lockedPayment;

  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    throw error;
  }
};
module.exports = {
  createPayment,
  processPaymentResult,
  getMyPayment,
  verifyPayment
};