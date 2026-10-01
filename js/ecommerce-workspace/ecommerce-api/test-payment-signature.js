const path = require("path");
const crypto = require("crypto");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

const razorpayOrderId =
  "order_TT8jBj9qOQNzNa";

const razorpayPaymentId =
  "pay_test_123";

const secret =
  process.env.RAZORPAY_KEY_SECRET;

if (!secret) {
  console.error(
    "RAZORPAY_KEY_SECRET is not loaded"
  );

  process.exit(1);
}

// Safe fingerprint of the secret.
// This does NOT print the actual secret.
const secretFingerprint =
  crypto
    .createHash("sha256")
    .update(secret)
    .digest("hex");

console.log(
  "Key secret loaded:",
  true
);

console.log(
  "Test script secret fingerprint:",
  secretFingerprint
);

console.log(
  "Razorpay Order ID:",
  razorpayOrderId
);

console.log(
  "Razorpay Payment ID:",
  razorpayPaymentId
);

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
  "Generated Signature:",
  signature
);

const hmacInput =
  `${razorpayOrderId}|${razorpayPaymentId}`;

console.log(
  "HMAC input JSON:",
  JSON.stringify(hmacInput)
);

console.log(
  "HMAC input length:",
  hmacInput.length
);

console.log(
  "HMAC input bytes:",
  Buffer.from(hmacInput)
);