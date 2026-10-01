const crypto = require("crypto");

const {
  sequelize,
  Payment,
  Order,
  User
} = require("@ecommerce/ecommerce-data-model");

const RazorpayService =
  require("../../../services/razorpay-service");

const MailService =
  require("../../../services/mail-service");


class PaymentService {

  constructor() {

    // External Razorpay service
    this.razorpayService =
      new RazorpayService();

    // Email service
    this.mailService =
      new MailService();
  }


  // ============================================================
  // CREATE PAYMENT
  // ============================================================

  async createPayment(
    userId,
    orderId
  ) {

    // Find user's order
    const order =
      await Order.findOne({
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


    // Only pending orders can be paid
    if (order.status !== "PENDING") {

      const error = new Error(
        `Payment cannot be created for an order with status ${order.status}`
      );

      error.statusCode = 409;

      throw error;
    }


    // Prevent duplicate payment
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


    // Razorpay expects amount in paise
    const amountInPaise =
      Math.round(
        Number(order.total_amount) * 100
      );


    if (amountInPaise < 100) {

      const error = new Error(
        "Payment amount must be at least ₹1"
      );

      error.statusCode = 400;

      throw error;
    }


    // Create Razorpay order
    const razorpayOrder =
      await this.razorpayService.createRazorpayOrder({
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


    // Create payment record
    const payment =
      await Payment.create({

        user_id:
          userId,

        order_id:
          order.id,

        amount:
          order.total_amount,

        status:
          "PENDING",

        razorpay_order_id:
          razorpayOrder.id
      });


    return {

      payment: {

        id:
          payment.id,

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
  }


  // ============================================================
  // PROCESS PAYMENT RESULT
  // ============================================================

  async processPaymentResult({
    paymentId,
    gatewayReference,
    success
  }) {

    const transaction =
      await sequelize.transaction();


    try {

      const payment =
        await Payment.findByPk(
          paymentId,
          {
            transaction,

            lock:
              transaction.LOCK.UPDATE
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


      // Don't process successful payment again
      if (
        payment.status === "SUCCESS"
      ) {

        await transaction.commit();

        return payment;
      }


      if (success) {

        payment.status =
          "SUCCESS";

        payment.gateway_reference =
          gatewayReference;


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

      } else {

        payment.status =
          "FAILED";

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
  }


  // ============================================================
  // GET MY PAYMENT
  // ============================================================

  async getMyPayment(
    userId,
    orderId
  ) {

    const payment =
      await Payment.findOne({

        where: {
          user_id:
            userId,

          order_id:
            orderId
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
  }


  // ============================================================
  // VERIFY PAYMENT
  // ============================================================

  async verifyPayment({
    userId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  }) {

    // Find payment
    const payment =
      await Payment.findOne({
        where: {
          user_id:
            userId,

          razorpay_order_id:
            razorpayOrderId
        }
      });


    if (!payment) {

      const error = new Error(
        "Payment not found"
      );

      error.statusCode = 404;

      throw error;
    }


    // Already verified
    if (
      payment.status === "SUCCESS"
    ) {
      return payment;
    }


    // Get Razorpay order ID stored on server
    const serverRazorpayOrderId =
      payment.razorpay_order_id;


    // Create signature input
    const hmacInput =
      `${serverRazorpayOrderId}|${razorpayPaymentId}`;


    // Generate expected signature
    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(hmacInput)
        .digest("hex");


    // Validate signature
    if (
      typeof razorpaySignature !==
        "string" ||
      generatedSignature.length !==
        razorpaySignature.length
    ) {

      const error = new Error(
        "Invalid payment signature"
      );

      error.statusCode = 400;

      throw error;
    }


    // Securely compare signatures
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


    // Start transaction
    const transaction =
      await sequelize.transaction();


    try {

      // Lock payment row
      const lockedPayment =
        await Payment.findByPk(
          payment.id,
          {
            transaction,

            lock:
              transaction.LOCK.UPDATE
          }
        );


      if (!lockedPayment) {

        const error = new Error(
          "Payment not found"
        );

        error.statusCode = 404;

        throw error;
      }


      // Prevent duplicate processing
      if (
        lockedPayment.status ===
        "SUCCESS"
      ) {

        await transaction.commit();

        return lockedPayment;
      }


      // Lock order row
      const order =
        await Order.findByPk(
          lockedPayment.order_id,
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


      // Cancelled orders cannot be paid
      if (
        order.status ===
        "CANCELLED"
      ) {

        const error = new Error(
          "Payment cannot be verified for a cancelled order"
        );

        error.statusCode = 409;

        throw error;
      }


      // Save Razorpay payment details
      lockedPayment.razorpay_payment_id =
        razorpayPaymentId;

      lockedPayment.razorpay_signature =
        razorpaySignature;

      lockedPayment.status =
        "SUCCESS";


      await lockedPayment.save({
        transaction
      });


      // Successful payment confirms order
      if (
        order.status === "PENDING"
      ) {

        order.status =
          "CONFIRMED";

        await order.save({
          transaction
        });
      }


      // Commit DB changes first
      await transaction.commit();


      // ========================================================
      // SEND PAYMENT SUCCESS EMAIL
      // ========================================================

      try {

        const user =
          await User.findByPk(
            userId,
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
                lockedPayment.amount
            });
        }

      } catch (emailError) {

        // Email failure should not
        // undo successful payment
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
  }
}


module.exports = PaymentService;