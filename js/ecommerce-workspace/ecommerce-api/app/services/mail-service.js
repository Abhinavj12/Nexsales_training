const nodemailer = require("nodemailer");

const smtpPort = Number(
  process.env.SMTP_PORT || 587
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,

  port: smtpPort,

  secure: smtpPort === 465,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },

  connectionTimeout: 10000,

  greetingTimeout: 10000,

  socketTimeout: 15000
});

const sendVerificationEmail = async ({
  email,
  firstName,
  verificationToken
}) => {
  const verificationUrl =
    `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,

    subject: "Verify your Ecommerce account",

    text:
      `Hello ${firstName},\n\n` +
      `Please verify your email address by opening this link:\n\n` +
      `${verificationUrl}\n\n` +
      `This verification link expires in 30 minutes.\n\n` +
      `If you did not create this account, you can ignore this email.`,

    html: `
      <p>Hello ${firstName},</p>

      <p>
        Please verify your email address by clicking
        the button below.
      </p>

      <p>
        <a href="${verificationUrl}">
          Verify Email
        </a>
      </p>

      <p>
        This verification link expires in 30 minutes.
      </p>

      <p>
        If you did not create this account,
        you can ignore this email.
      </p>
    `
  });
};

const verifyMailTransporter = async () => {
  try {
    await transporter.verify();

    console.log("SMTP connection successful");

    return true;
  } catch (error) {
    console.error(
      "SMTP connection failed:",
      error.message
    );

    return false;
  }
};
const sendPasswordResetEmail = async ({
  email,
  firstName,
  resetToken
}) => {
  const resetUrl =
    `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Reset your Ecommerce password",

    text:
      `Hello ${firstName},\n\n` +
      `We received a request to reset your password.\n\n` +
      `Reset your password using this link:\n\n` +
      `${resetUrl}\n\n` +
      `This password reset link expires in 30 minutes.\n\n` +
      `If you did not request a password reset, you can ignore this email.`,

    html: `
      <p>Hello ${firstName},</p>

      <p>
        We received a request to reset your password.
      </p>

      <p>
        Click the button below to reset your password.
      </p>

      <p>
        <a href="${resetUrl}">
          Reset Password
        </a>
      </p>

      <p>
        This password reset link expires in 30 minutes.
      </p>

      <p>
        If you did not request a password reset,
        you can ignore this email.
      </p>
    `
  });
};
const sendOrderPlacedEmail = async ({
  email,
  firstName,
  orderId,
  totalAmount
}) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Your order has been placed",

    text:
      `Hello ${firstName},\n\n` +
      `Your order has been placed successfully.\n\n` +
      `Order ID: ${orderId}\n` +
      `Total Amount: ₹${totalAmount}\n\n` +
      `Thank you for shopping with us.`,

    html: `
      <p>Hello ${firstName},</p>

      <p>
        Your order has been placed successfully.
      </p>

      <p>
        <strong>Order ID:</strong> ${orderId}<br>
        <strong>Total Amount:</strong> ₹${totalAmount}
      </p>

      <p>
        Thank you for shopping with us.
      </p>
    `
  });
};
const sendPaymentSuccessEmail = async ({
  email,
  firstName,
  orderId,
  paymentId,
  amount
}) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,

    subject: "Payment successful",

    text:
      `Hello ${firstName},\n\n` +
      `Your payment was successful.\n\n` +
      `Order ID: ${orderId}\n` +
      `Payment ID: ${paymentId}\n` +
      `Amount: ₹${amount}\n\n` +
      `Thank you for your purchase.`,

    html: `
      <p>Hello ${firstName},</p>

      <p>
        Your payment was successful.
      </p>

      <p>
        <strong>Order ID:</strong> ${orderId}<br>
        <strong>Payment ID:</strong> ${paymentId}<br>
        <strong>Amount:</strong> ₹${amount}
      </p>

      <p>
        Thank you for your purchase.
      </p>
    `
  });
};
module.exports = {
  sendVerificationEmail,
  verifyMailTransporter,
  sendPasswordResetEmail,
  sendOrderPlacedEmail,
  sendPaymentSuccessEmail
};