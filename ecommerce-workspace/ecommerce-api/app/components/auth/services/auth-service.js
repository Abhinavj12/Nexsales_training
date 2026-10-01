const {
  User,
  EmailVerificationToken,
  sequelize,
  PasswordResetToken
} = require("@ecommerce/ecommerce-data-model");

const {
  hashPassword,
  comparePassword
} = require("../../../utils/password");

const {
  generateVerificationToken,
  hashVerificationToken
} = require("../../../utils/verification-token");

const MailService =
  require("../../../services/mail-service");

const {
  generateAccessToken
} = require("../../../utils/jwt");

const {
  generatePasswordResetToken,
  hashPasswordResetToken
} = require("../../../utils/password-reset-token");


/*
 * AuthService
 *
 * Contains all authentication business logic:
 *
 * 1. Register user
 * 2. Create admin
 * 3. Verify email
 * 4. Login
 * 5. Forgot password
 * 6. Reset password
 */

class AuthService {

  constructor() {

    // Create MailService instance
    this.mailService =
      new MailService();
  }


  // ============================================================
  // REGISTER USER
  // ============================================================

  async register(data) {

    const {
      first_name,
      last_name,
      email,
      password
    } = data;


    // Check whether email already exists
    const existingUser =
      await User.findOne({
        where: {
          email
        }
      });

    if (existingUser) {

      const error = new Error(
        "An account with this email already exists"
      );

      error.statusCode = 409;

      throw error;
    }


    // Hash password before storing it
    const password_hash =
      await hashPassword(password);


    // Create user
    const user =
      await User.create({
        first_name,
        last_name,
        email,
        password_hash
      });


    try {

      // Generate email verification token
      const {
        rawToken,
        tokenHash,
        expiresAt
      } =
        generateVerificationToken();


      // Store hashed token
      await EmailVerificationToken.create({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt
      });


      // Send verification email
      await this.mailService.sendVerificationEmail({
        email: user.email,
        firstName: user.first_name,
        verificationToken: rawToken
      });

    } catch (error) {

      // If email/token creation fails,
      // remove the newly created user
      await user.destroy();

      throw error;
    }


    // Return safe user information
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified
    };
  }


  // ============================================================
  // CREATE ADMIN
  // ============================================================

  async createAdmin(data) {

    const {
      first_name,
      last_name,
      email,
      password
    } = data;


    // Check whether email already exists
    const existingUser =
      await User.findOne({
        where: {
          email
        }
      });

    if (existingUser) {

      const error = new Error(
        "An account with this email already exists"
      );

      error.statusCode = 409;

      throw error;
    }


    // Hash admin password
    const password_hash =
      await hashPassword(password);


    // Create ADMIN user
    const user =
      await User.create({
        first_name,
        last_name,
        email,
        password_hash,
        role: "ADMIN"
      });


    try {

      // Generate verification token
      const {
        rawToken,
        tokenHash,
        expiresAt
      } =
        generateVerificationToken();


      // Store hashed verification token
      await EmailVerificationToken.create({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt
      });


      // Send verification email
      await this.mailService.sendVerificationEmail({
        email: user.email,
        firstName: user.first_name,
        verificationToken: rawToken
      });

    } catch (error) {

      // Remove admin if email process fails
      await user.destroy();

      throw error;
    }


    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified
    };
  }


  // ============================================================
  // VERIFY EMAIL
  // ============================================================

  async verifyEmail(rawToken) {

    // Token is required
    if (!rawToken) {

      const error = new Error(
        "Verification token is required"
      );

      error.statusCode = 400;

      throw error;
    }


    // Hash token received from user
    const tokenHash =
      hashVerificationToken(rawToken);


    // Find verification token
    const verificationToken =
      await EmailVerificationToken.findOne({
        where: {
          token_hash: tokenHash
        },
        include: [
          {
            model: User,
            as: "user"
          }
        ]
      });


    // Invalid token
    if (!verificationToken) {

      const error = new Error(
        "Invalid verification token"
      );

      error.statusCode = 400;

      throw error;
    }


    // Token already used
    if (verificationToken.used_at) {

      const error = new Error(
        "Verification token has already been used"
      );

      error.statusCode = 400;

      throw error;
    }


    // Token expired
    if (
      new Date() >
      verificationToken.expires_at
    ) {

      const error = new Error(
        "Verification token has expired"
      );

      error.statusCode = 400;

      throw error;
    }


    // Get associated user
    const user =
      verificationToken.user;


    if (!user) {

      const error = new Error(
        "Associated user was not found"
      );

      error.statusCode = 400;

      throw error;
    }


    // Use transaction so both updates
    // succeed or fail together
    const transaction =
      await sequelize.transaction();


    try {

      // Mark user as verified
      user.is_verified = true;

      await user.save({
        transaction
      });


      // Mark token as used
      verificationToken.used_at =
        new Date();

      await verificationToken.save({
        transaction
      });


      await transaction.commit();


      return {
        id: user.id,
        email: user.email,
        is_verified: user.is_verified
      };

    } catch (error) {

      await transaction.rollback();

      throw error;
    }
  }


  // ============================================================
  // LOGIN
  // ============================================================

  async login(data) {

    const {
      email,
      password
    } = data;


    // Find user by email
    const user =
      await User.findOne({
        where: {
          email
        }
      });


    // User doesn't exist
    if (!user) {

      const error = new Error(
        "Invalid email or Password"
      );

      error.statusCode = 401;

      throw error;
    }


    // Blocked users cannot login
    if (user.is_blocked) {

      const error = new Error(
        "Your account has been blocked"
      );

      error.statusCode = 403;

      throw error;
    }


    // User must verify email
    if (!user.is_verified) {

      const error = new Error(
        "Please verify your email before logging in"
      );

      error.statusCode = 403;

      throw error;
    }


    // Compare password with hash
    const passwordValid =
      await comparePassword(
        password,
        user.password_hash
      );


    if (!passwordValid) {

      const error = new Error(
        "Invalid email or password"
      );

      error.statusCode = 401;

      throw error;
    }


    // Generate JWT
    const accessToken =
      generateAccessToken(user);


    // Return JWT + safe user information
    return {

      accessToken,

      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified
      }
    };
  }


  // ============================================================
  // FORGOT PASSWORD
  // ============================================================

  async forgotPassword(email) {

    // Find user
    const user =
      await User.findOne({
        where: {
          email
        }
      });


    // Don't reveal whether email exists
    if (!user) {
      return;
    }


    // Invalidate previous reset tokens
    await PasswordResetToken.update(
      {
        used_at: new Date()
      },
      {
        where: {
          user_id: user.id,
          used_at: null
        }
      }
    );


    // Generate reset token
    const {
      rawToken,
      tokenHash,
      expiresAt
    } =
      generatePasswordResetToken();


    // Store hashed reset token
    await PasswordResetToken.create({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt
    });


    // Send password reset email
    await this.mailService.sendPasswordResetEmail({
      email: user.email,
      firstName: user.first_name,
      resetToken: rawToken
    });
  }


  // ============================================================
  // RESET PASSWORD
  // ============================================================

  async resetPassword({
    token,
    password
  }) {

    // Token required
    if (!token) {

      const error = new Error(
        "Password reset token is required"
      );

      error.statusCode = 400;

      throw error;
    }


    // Hash received token
    const tokenHash =
      hashPasswordResetToken(token);


    // Find reset token
    const resetToken =
      await PasswordResetToken.findOne({
        where: {
          token_hash: tokenHash
        }
      });


    // Invalid token
    if (!resetToken) {

      const error = new Error(
        "Invalid password reset token"
      );

      error.statusCode = 400;

      throw error;
    }


    // Token already used
    if (resetToken.used_at) {

      const error = new Error(
        "Password reset token has already been used"
      );

      error.statusCode = 400;

      throw error;
    }


    // Token expired
    if (
      new Date() >
      resetToken.expires_at
    ) {

      const error = new Error(
        "Password reset token has expired"
      );

      error.statusCode = 400;

      throw error;
    }


    // Find associated user
    const user =
      await User.findByPk(
        resetToken.user_id
      );


    if (!user) {

      const error = new Error(
        "Associated user was not found"
      );

      error.statusCode = 400;

      throw error;
    }


    // Hash new password
    const password_hash =
      await hashPassword(password);


    // Update password + consume token
    // inside one transaction
    const transaction =
      await sequelize.transaction();


    try {

      user.password_hash =
        password_hash;

      await user.save({
        transaction
      });


      resetToken.used_at =
        new Date();

      await resetToken.save({
        transaction
      });


      await transaction.commit();


      return {
        id: user.id,
        email: user.email
      };

    } catch (error) {

      await transaction.rollback();

      throw error;
    }
  }
}


// Export the class
module.exports = AuthService;