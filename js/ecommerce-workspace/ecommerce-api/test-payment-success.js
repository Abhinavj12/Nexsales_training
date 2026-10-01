const path = require("path");
const crypto = require("crypto");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

// PUT THE REAL RAZORPAY ORDER ID HERE
const razorpayOrderId =
  "order_TTBu4jzqnnMpXz";

// Use a NEW payment ID every test
const razorpayPaymentId =
  "pay_TEST_SUCCESS_002";

const secret =
  process.env.RAZORPAY_KEY_SECRET;

if (!secret) {
  console.error(
    "RAZORPAY_KEY_SECRET is not loaded"
  );

  process.exit(1);
}

const signature =
  crypto
    .createHmac(
      "sha256",
      secret
    )
    .update(
      `${razorpayOrderId}|${razorpayPaymentId}`
    )
    .digest("hex");

console.log(
  "Razorpay Order ID:",
  razorpayOrderId
);

console.log(
  "Razorpay Payment ID:",
  razorpayPaymentId
);

console.log(
  "Generated Signature:",
  signature
);