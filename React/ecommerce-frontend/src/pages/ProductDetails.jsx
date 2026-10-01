import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";
import Navbar from "../components/Navbar";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);

  const [addingToCart, setAddingToCart] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);

        console.log(
          "Product Details Response:",
          response
        );

        setProduct(response.data);
      } catch (error) {
        console.error(
          "Product Details Error:",
          error
        );

        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setMessage("");
    setError("");

    try {
      setAddingToCart(true);

      const response = await addToCart(
        product.id,
        quantity
      );

      console.log(
        "Add To Cart Response:",
        response
      );

      setMessage(
        "Product added to cart successfully"
      );
    } catch (error) {
      console.error(
        "Add To Cart Error:",
        error
      );

      const backendMessage =
        error.response?.data?.message;

      setError(
        backendMessage ||
          "Failed to add product to cart"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main style={{ padding: "30px" }}>
          <h2>Loading product...</h2>
        </main>
      </>
    );
  }

  if (error && !product) {
    return (
      <>
        <Navbar />

        <main style={{ padding: "30px" }}>
          <h2>{error}</h2>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />

        <main style={{ padding: "30px" }}>
          <h2>Product not found</h2>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main style={{ padding: "30px" }}>

        <h1>{product.name}</h1>

        <p>
          <strong>SKU:</strong>{" "}
          {product.sku}
        </p>

        <p>
          <strong>Description:</strong>{" "}
          {product.description ||
            "No description available"}
        </p>

        <p>
          <strong>Price:</strong>{" "}
          ₹{product.price}
        </p>

        <p>
          <strong>Stock:</strong>{" "}
          {product.stock_quantity}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {product.status}
        </p>

        {/* Product Images */}

        {product.images &&
          product.images.length > 0 && (
            <div>
              <h2>Product Images</h2>

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  flexWrap: "wrap"
                }}
              >
                {product.images.map(
                  (image) => (
                    <img
                      key={image.id}
                      src={image.image_url}
                      alt={product.name}
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px"
                      }}
                    />
                  )
                )}
              </div>
            </div>
          )}

        <br />

        {/* Quantity */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "15px"
          }}
        >
          <strong>Quantity:</strong>

          <button
            disabled={quantity <= 1}
            onClick={() =>
              setQuantity(quantity - 1)
            }
          >
            -
          </button>

          <span>{quantity}</span>

          <button
            disabled={
              quantity >=
              product.stock_quantity
            }
            onClick={() =>
              setQuantity(quantity + 1)
            }
          >
            +
          </button>
        </div>

        {/* Add To Cart */}

        <button
          disabled={
            addingToCart ||
            product.stock_quantity <= 0 ||
            product.status !== "ACTIVE"
          }
          onClick={handleAddToCart}
        >
          {addingToCart
            ? "Adding..."
            : "Add to Cart"}
        </button>

        {/* Success */}

        {message && (
          <p
            style={{
              marginTop: "15px"
            }}
          >
            {message}
          </p>
        )}

        {/* Error */}

        {error && (
          <p
            style={{
              marginTop: "15px"
            }}
          >
            {error}
          </p>
        )}

      </main>
    </>
  );
};

export default ProductDetails;