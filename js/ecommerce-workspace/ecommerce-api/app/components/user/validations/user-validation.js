const { z } = require("zod");

const updateProfileSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "First name must be between 2 and 50 characters")
    .max(50, "First name must be between 2 and 50 characters")
    .regex(
      /^[A-Za-z]+$/,
      "First name must contain letters only"
    ),

  last_name: z
    .string()
    .trim()
    .min(2, "Last name must be between 2 and 50 characters")
    .max(50, "Last name must be between 2 and 50 characters")
    .regex(
      /^[A-Za-z]+$/,
      "Last name must contain letters only"
    )
}).strict();
const changePasswordSchema = z.object({
  current_password: z
    .string()
    .min(1, "Current password is required"),

  new_password: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(100, "New password must not exceed 100 characters")
    .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
    .regex(/[a-z]/, "New password must contain at least one lowercase letter")
    .regex(/[0-9]/, "New password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "New password must contain at least one special character"
    )
}).strict();

const updateUserBlockSchema = z.object({
  is_blocked: z.boolean()
}).strict();

module.exports = {
  updateProfileSchema,
  changePasswordSchema,
  updateUserBlockSchema
};