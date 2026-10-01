const {
  User
} = require("@ecommerce/ecommerce-data-model");

const {
  hashPassword,
  comparePassword
} = require("../utils/password");


class UserService {

  // Get the logged-in user's profile
  async getMyProfile(userId) {

    const user = await User.findByPk(userId, {
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "role",
        "is_verified",
        "created_at",
        "updated_at"
      ]
    });

    if (!user) {
      const error = new Error(
        "User not found"
      );

      error.statusCode = 404;

      throw error;
    }

    return user;
  }
async getAdminProfile(userId){
  const user = await User.findByPk(userId, {
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "role",
        "is_verified",
        "created_at",
        "updated_at"
      ]
    });
    if (!user) {
      const error = new Error(
        "Admin not found"
      );

      error.statusCode = 404;

      throw error;
    }

    return user;
}

  // Update the logged-in user's profile
  async updateMyProfile(userId, data) {

    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error(
        "User not found"
      );

      error.statusCode = 404;

      throw error;
    }

    user.first_name = data.first_name;
    user.last_name = data.last_name;

    await user.save();

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }


  // Change the logged-in user's password
  async changeMyPassword(userId, data) {

    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error(
        "User not found"
      );

      error.statusCode = 404;

      throw error;
    }

    const isPasswordValid =
      await comparePassword(
        data.current_password,
        user.password_hash
      );

    if (!isPasswordValid) {
      const error = new Error(
        "Current password is incorrect"
      );

      error.statusCode = 401;

      throw error;
    }

    // Prevent using the same password again
    const samePassword =
      await comparePassword(
        data.new_password,
        user.password_hash
      );

    if (samePassword) {
      const error = new Error(
        "New password must be different from current password"
      );

      error.statusCode = 400;

      throw error;
    }

    user.password_hash =
      await hashPassword(
        data.new_password
      );

    await user.save();

    return {
      id: user.id,
      email: user.email
    };
  }


  // Admin blocks or unblocks a user
  async blockUser(
    adminId,
    userId,
    isBlocked
  ) {

    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error(
        "User not found"
      );

      error.statusCode = 404;

      throw error;
    }

    // Prevent admin from blocking themselves
    if (adminId === user.id) {
      const error = new Error(
        "You cannot block your own account"
      );

      error.statusCode = 400;

      throw error;
    }

    user.is_blocked = isBlocked;

    await user.save();

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
      is_blocked: user.is_blocked
    };
  }


  // Get all users for admin
  async getAllUsers() {

    const users = await User.findAll({
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "role",
        "is_verified",
        "is_blocked",
        "createdAt",
        "updatedAt"
      ],
      order: [
        ["createdAt", "DESC"]
      ]
    });

    return users;
  }
}


module.exports = UserService;