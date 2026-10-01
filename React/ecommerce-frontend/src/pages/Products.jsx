import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import Navbar from "../components/Navbar";

const Products = () => {
    // Products data
    const [products, setProducts] = useState([]);

    // Loading and error
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Sorting
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("DESC");

    // Pagination
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});

    // Fetch products
    const fetchProducts = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getAllProducts({
                search: searchQuery,
                sort_by: sortBy,
                sort_order: sortOrder,
                page: page,
                limit: 10
            });

            console.log("Products Response:", response);

            setProducts(response.data || []);
            setPagination(response.pagination || {});
        } catch (error) {
            console.error("Products Error:", error);

            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    // Fetch whenever page/search/sort changes
    useEffect(() => {
        fetchProducts();
    }, [page, searchQuery, sortBy, sortOrder]);

    // Search button
    const handleSearch = () => {
        setPage(1);
        setSearchQuery(search);
    };

    // Clear search
    const handleClearSearch = () => {
        setSearch("");
        setSearchQuery("");
        setPage(1);
    };

    // Loading
    if (loading) {
        return (
            <>
                <Navbar />

                <main style={{ padding: "30px" }}>
                    <h2>Loading products...</h2>
                </main>
            </>
        );
    }

    // Error
    if (error) {
        return (
            <>
                <Navbar />

                <main style={{ padding: "30px" }}>
                    <h2>{error}</h2>

                    <button onClick={fetchProducts}>
                        Try Again
                    </button>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main style={{ padding: "30px" }}>

                <h1>Products</h1>

                {/* Search and Sorting */}
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "30px",
                        alignItems: "center",
                        flexWrap: "wrap"
                    }}
                >

                    {/* Search input */}
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        style={{
                            padding: "10px",
                            width: "250px"
                        }}
                    />

                    {/* Search button */}
                    <button onClick={handleSearch}>
                        Search
                    </button>

                    {/* Clear button */}
                    {searchQuery && (
                        <button onClick={handleClearSearch}>
                            Clear
                        </button>
                    )}

                    {/* Sort */}
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(event) => {
                            const [
                                newSortBy,
                                newSortOrder
                            ] = event.target.value.split("-");

                            setPage(1);
                            setSortBy(newSortBy);
                            setSortOrder(newSortOrder);
                        }}
                        style={{
                            padding: "10px"
                        }}
                    >

                        <option value="createdAt-DESC">
                            Newest
                        </option>

                        <option value="createdAt-ASC">
                            Oldest
                        </option>

                        <option value="name-ASC">
                            Name A → Z
                        </option>

                        <option value="name-DESC">
                            Name Z → A
                        </option>

                        <option value="price-ASC">
                            Price Low → High
                        </option>

                        <option value="price-DESC">
                            Price High → Low
                        </option>

                    </select>
                </div>

                {/* Product list */}
                {products.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(250px, 1fr))",
                            gap: "20px"
                        }}
                    >

                        {products.map((product) => (
                            <div
                                key={product.id}
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "20px",
                                    textAlign: "left"
                                }}
                            >

                                <h2>{product.name}</h2>

                                <p>
                                    <strong>SKU:</strong>{" "}
                                    {product.sku}
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

                                <button
                                    onClick={() =>
                                        window.location.href = `/products/${product.id}`
                                    }
                                >
                                    View Details
                                </button>

                            </div>
                        ))}

                    </div>
                )}

                {/* Pagination */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "15px",
                        marginTop: "30px"
                    }}
                >

                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        Page {pagination.page || 1} of{" "}
                        {pagination.totalPages || 1}
                    </span>

                    <button
                        disabled={
                            page >=
                            (pagination.totalPages || 1)
                        }
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>

                </div>

            </main>
        </>
    );
};

export default Products;