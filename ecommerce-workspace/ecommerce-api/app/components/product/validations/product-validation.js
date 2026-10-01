const { z } = require("zod");

const createProductSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(2, "SKU must be between 2 and 100 characters")
    .max(100, "SKU must be between 2 and 100 characters"),

  name: z
    .string()
    .trim()
    .min(
      2,
      "Product name must be between 2 and 200 characters"
    )
    .max(
      200,
      "Product name must be between 2 and 200 characters"
    ),

  description: z
    .string()
    .trim()
    .max(
      10000,
      "Description must not exceed 10000 characters"
    )
    .optional(),

  category_id: z
    .string()
    .uuid("Category ID must be a valid UUID"),

  price: z
    .coerce
    .number()
    .min(0, "Price cannot be negative"),

  stock_quantity: z
    .coerce
    .number()
    .int("Stock quantity must be an integer")
    .min(0, "Stock quantity cannot be negative"),

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional()
}).strict();

const productQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .max(200)
    .optional(),

  category_id: z
    .string()
    .uuid("Category ID must be a valid UUID")
    .optional(),

  min_price: z
    .coerce
    .number()
    .min(0, "Minimum price cannot be negative")
    .optional(),

  max_price: z
    .coerce
    .number()
    .min(0, "Maximum price cannot be negative")
    .optional(),

  sort_by: z
    .enum([
      "name",
      "price",
      "createdAt"
    ])
    .default("createdAt"),

  sort_order: z
    .enum(["ASC", "DESC"])
    .default("DESC"),

  page: z
    .coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10)
}).strict().refine(
  (data) => {
    if (
      data.min_price !== undefined &&
      data.max_price !== undefined
    ) {
      return data.min_price <= data.max_price;
    }

    return true;
  },
  {
    message:
      "Minimum price cannot be greater than maximum price",
    path: ["min_price"]
  }
);
const updateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "Product name must be between 2 and 200 characters"
    )
    .max(
      200,
      "Product name must be between 2 and 200 characters"
    )
    .optional(),

  description: z
    .string()
    .trim()
    .max(
      10000,
      "Description must not exceed 10000 characters"
    )
    .optional(),

  category_id: z
    .string()
    .uuid("Category ID must be a valid UUID")
    .optional(),

  price: z
    .coerce
    .number()
    .min(0, "Price cannot be negative")
    .optional(),

  stock_quantity: z
    .coerce
    .number()
    .int("Stock quantity must be an integer")
    .min(0, "Stock quantity cannot be negative")
    .optional(),

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional()
})
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided"
    }
  );
module.exports = {
  createProductSchema,
  productQuerySchema,
  updateProductSchema
};