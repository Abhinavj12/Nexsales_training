const path = require("path");
const crypto = require("crypto");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

const body = JSON.stringify({
  event: "payment.captured",
  payload: {
    payment: {
      entity: {
        id: "pay_test_456",
        order_id: "order_TT9r6QlRXwwcmx"
      }
    }
  }
});

const secret =
  process.env.RAZORPAY_WEBHOOK_SECRET;

if (!secret) {
  console.error(
    "RAZORPAY_WEBHOOK_SECRET is not loaded"
  );
  process.exit(1);
}

const signature =
  crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

console.log("Webhook secret loaded:", true);
console.log("\nRAW BODY:");
console.log(body);

console.log("\nSIGNATURE:");
console.log(signature);

console.log("\nEVENT ID:");
console.log("evt_test_456");