const { z } = require("zod");

const addCartItemSchema = z.object({
  product_id: z
    .string()
    .uuid("Product ID must be a valid UUID"),

  quantity: z
    .coerce
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
}).strict();

const updateCartItemSchema = z.object({
  quantity: z
    .coerce
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
}).strict();

module.exports = {
  addCartItemSchema,
  updateCartItemSchema
};