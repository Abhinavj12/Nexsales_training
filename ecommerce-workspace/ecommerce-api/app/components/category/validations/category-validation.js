const { z } = require("zod");

const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be between 2 and 100 characters")
    .max(100, "Category name must be between 2 and 100 characters"),

  description: z
    .string()
    .trim()
    .max(5000, "Description must not exceed 5000 characters")
    .optional(),

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional()
}).strict();
const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "Category name must be between 2 and 100 characters"
    )
    .max(
      100,
      "Category name must be between 2 and 100 characters"
    )
    .optional(),

  description: z
    .string()
    .trim()
    .max(
      5000,
      "Description must not exceed 5000 characters"
    )
    .optional(),

  status: z
    .enum(["ACTIVE", "INACTIVE"])
    .optional()
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided"
  }
);
module.exports = {
  createCategorySchema,
  updateCategorySchema        
};