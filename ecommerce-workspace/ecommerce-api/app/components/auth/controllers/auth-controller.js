const AuthService = require("../services/auth-service");

const {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  createAdminSchema
} = require("../validations/auth-validation");


/*
 * AuthController
 *
 * Controller is responsible for:
 *
 * - Receiving request
 * - Validating request data
 * - Calling AuthService
 * - Sending HTTP response
 *
 * Business logic stays inside AuthService.
 */
class AuthController {

  constructor() {

    // Create one AuthService instance
    // and use it throughout the controller.
    this.service = new AuthService();
  }


  // ============================================================
  // REGISTER
  // ============================================================

  async registerUser(req, res, next) {

    try {

      // Validate request body using Zod
      const validatedData =
        registerSchema.parse(req.body);

      // Pass validated data to service
      const user =
        await this.service.register(
          validatedData
        );

      // Send response to client
      return res.status(201).json({
        success: true,
        message:
          "Registration successful. Please verify your email address.",
        data: user
      });

    } catch (error) {

      // Pass error to centralized error middleware
      next(error);
    }
  }


  // ============================================================
  // CREATE ADMIN
  // ============================================================

  async createAdminUser(req, res, next) {

    try {

      // Validate admin data
      const validatedData =
        createAdminSchema.parse(req.body);

      // Call service
      const admin =
        await this.service.createAdmin(
          validatedData
        );

      return res.status(201).json({
        success: true,
        message:
          "Admin created successfully. Please verify the email address.",
        data: admin
      });

    } catch (error) {

      next(error);
    }
  }


  // ============================================================
  // VERIFY EMAIL
  // ============================================================

  async verifyUserEmail(req, res, next) {

    try {

      // Token comes from query parameter
      const { token } = req.query;

      // Call service
      const result =
        await this.service.verifyEmail(
          token
        );

      return res.status(200).json({
        success: true,
        message:
          "Email verified successfully",
        data: result
      });

    } catch (error) {

      next(error);
    }
  }


  // ============================================================
  // LOGIN
  // ============================================================

  async loginUser(req, res, next) {

    try {

      // Validate login body
      const validatedData =
        loginSchema.parse(req.body);

      // Call authentication service
      const result =
        await this.service.login(
          validatedData
        );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result
      });

    } catch (error) {

      next(error);
    }
  }


  // ============================================================
  // CURRENT USER
  // ============================================================

  async getCurrentUser(req, res, next) {

    try {

      // Authentication middleware already
      // verified the JWT and populated req.user.
      return res.status(200).json({
        success: true,
        message:
          "Authentication successful",
        data: {
          userId: req.user.id,
          role: req.user.role
        }
      });

    } catch (error) {

      next(error);
    }
  }


  // ============================================================
  // ADMIN TEST
  // ============================================================

  async getAdminTest(req, res, next) {

    try {

      // This endpoint is reached only after
      // authentication + admin authorization.
      return res.status(200).json({
        success: true,
        message:
          "Admin authorization successful",
        data: {
          userId: req.user.id,
          role: req.user.role
        }
      });

    } catch (error) {

      next(error);
    }
  }


  // ============================================================
  // RESET PASSWORD
  // ============================================================

  async resetPassword(req, res, next) {

    try {

      // Validate reset password request
      const validatedData =
        resetPasswordSchema.parse(
          req.body
        );

      // Call service
      const result =
        await this.service.resetPassword(
          validatedData
        );

      return res.status(200).json({
        success: true,
        message:
          "Password reset successful",
        data: result
      });

    } catch (error) {

      next(error);
    }
  }


  // ============================================================
  // FORGOT PASSWORD
  // ============================================================

  async forgotPassword(req, res, next) {

    try {

      // Validate request
      const validatedData =
        forgotPasswordSchema.parse(
          req.body
        );

      // Call service
      await this.service.forgotPassword(
        validatedData.email
      );

      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, password reset instructions have been sent"
      });

    } catch (error) {

      next(error);
    }
  }
}


module.exports = AuthController;