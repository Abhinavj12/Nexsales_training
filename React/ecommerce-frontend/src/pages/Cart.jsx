import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../services/cartService";
import Navbar from "../components/Navbar";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItem, setUpdatingItem] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCart();

      console.log("Cart Response:", response);

      setCart(response.data);
    } catch (error) {
      console.error("Cart Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleIncrease = async (item) => {
    try {
      setUpdatingItem(item.id);

      const response = await updateCartItem(
        item.id,
        item.quantity + 1
      );

      console.log(
        "Update Cart Response:",
        response
      );

      await fetchCart();
    } catch (error) {
      console.error(
        "Increase quantity error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update quantity"
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) {
      return;
    }

    try {
      setUpdatingItem(item.id);

      const response = await updateCartItem(
        item.id,
        item.quantity - 1
      );

      console.log(
        "Update Cart Response:",
        response
      );

      await fetchCart();
    } catch (error) {
      console.error(
        "Decrease quantity error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update quantity"
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      setUpdatingItem(itemId);

      const response =
        await removeCartItem(itemId);

      console.log(
        "Remove Cart Item Response:",
        response
      );

      await fetchCart();
    } catch (error) {
      console.error(
        "Remove cart item error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to remove item"
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await clearCart();

      console.log(
        "Clear Cart Response:",
        response
      );

      await fetchCart();
    } catch (error) {
      console.error(
        "Clear cart error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to clear cart"
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main style={{ padding: "30px" }}>
          <h2>Loading cart...</h2>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main style={{ padding: "30px" }}>
        <h1>Your Cart</h1>

        {error && (
          <p>
            <strong>{error}</strong>
          </p>
        )}

        {!cart ||
        !cart.items ||
        cart.items.length === 0 ? (
          <div>
            <h2>Your cart is empty</h2>

            <button
              onClick={() =>
                navigate("/products")
              }
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}
            >
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "20px"
                  }}
                >
                  <h2>
                    {item.product?.name ||
                      "Product"}
                  </h2>

                  <p>
                    <strong>SKU:</strong>{" "}
                    {item.product?.sku}
                  </p>

                  <p>
                    <strong>Price:</strong>{" "}
                    ₹{item.product?.price}
                  </p>

                  {/* Quantity */}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    <strong>
                      Quantity:
                    </strong>

                    <button
                      disabled={
                        item.quantity <= 1 ||
                        updatingItem ===
                          item.id
                      }
                      onClick={() =>
                        handleDecrease(item)
                      }
                    >
                      -
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      disabled={
                        updatingItem ===
                        item.id
                      }
                      onClick={() =>
                        handleIncrease(item)
                      }
                    >
                      +
                    </button>
                  </div>

                  <p>
                    <strong>
                      Subtotal:
                    </strong>{" "}
                    ₹
                    {item.product?.price *
                      item.quantity}
                  </p>

                  <button
                    disabled={
                      updatingItem === item.id
                    }
                    onClick={() =>
                      handleRemove(item.id)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}

            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                borderTop:
                  "1px solid #ddd"
              }}
            >
              <h2>
                Total: ₹
                {cart.items.reduce(
                  (
                    total,
                    item
                  ) =>
                    total +
                    Number(
                      item.product?.price ||
                        0
                    ) *
                      item.quantity,
                  0
                )}
              </h2>

              <button
                onClick={
                  handleClearCart
                }
                style={{
                  marginRight: "10px"
                }}
              >
                Clear Cart
              </button>

              <button
                onClick={() =>
                  navigate("/orders/create")
                }
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Cart;