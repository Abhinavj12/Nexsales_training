const { z, email }=require("zod");

const nameSchema=z
    .string()
    .trim()
    .min(2,"Name must contain at least 2 charcters")
    .max(50,"Name must not exceed 50 characters")
    .regex(
        /^[A-Za-z]+$/,
        "Name must contain only letters"
    );

const registerSchema=z.object({
    first_name:nameSchema,
    last_name:nameSchema,
    email:z
          .string()
          .trim()
          .toLowerCase()
          .email("Inavlid email address"),
    password: z
  .string()
  .min(8, "Password must contain at least 8 characters")
  .max(128, "Password must not exceed 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")    
});

const loginSchema=z.object({
    email:z
        .string()
        .trim()
        .toLowerCase()
        .email("Inavalid email address"),
    password:z.
    string()
    .min(1, "Password is required")
    .max(
      128,
      "Password must not exceed 128 characters"
    )
});
const resetPasswordSchema = z.object({
  token: z
    .string()
    .trim()
    .min(1, "Reset token is required"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      /[A-Z]/,
      "Password must contain at least one uppercase letter"
    )
    .regex(
      /[a-z]/,
      "Password must contain at least one lowercase letter"
    )
    .regex(
      /[0-9]/,
      "Password must contain at least one number"
    )
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
});
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .transform((value) => value.toLowerCase())
});
const createAdminSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .regex(/^[A-Za-z]+$/, "First name must contain only letters"),

  last_name: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .regex(/^[A-Za-z]+$/, "Last name must contain only letters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
});
module.exports={
    registerSchema,
    loginSchema,
    resetPasswordSchema,
    forgotPasswordSchema,
    createAdminSchema
};