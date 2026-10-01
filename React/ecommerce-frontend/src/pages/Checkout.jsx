import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import Navbar from "../components/Navbar";

const Checkout = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await createOrder();

      console.log(
        "Create Order Response:",
        response
      );

      const orderId = response.data?.id;

      if (orderId) {
        navigate(`/orders/${orderId}`);
      } else {
        navigate("/orders");
      }
    } catch (error) {
      console.error(
        "Create Order Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main style={{ padding: "30px" }}>
        <h1>Checkout</h1>

        <p>
          Your cart items will be converted
          into an order.
        </p>

        {error && (
          <p>
            <strong>{error}</strong>
          </p>
        )}

        <button
          disabled={loading}
          onClick={handlePlaceOrder}
        >
          {loading
            ? "Placing Order..."
            : "Place Order"}
        </button>

        <button
          onClick={() => navigate("/cart")}
          style={{ marginLeft: "10px" }}
        >
          Back to Cart
        </button>
      </main>
    </>
  );
};

export default Checkout;