const { z } = require("zod");

const orderQuerySchema = z.object({
  status: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED"
    ])
    .optional(),

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
}).strict();
//Admin searh validation
const adminOrderQuerySchema = z.object({
  status: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED"
    ])
    .optional(),

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
}).strict();

const updateOrderStatusSchema = z.object({
  status: z.enum([
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED"
  ])
}).strict();
module.exports = {
  orderQuerySchema,
  adminOrderQuerySchema,
  updateOrderStatusSchema
};