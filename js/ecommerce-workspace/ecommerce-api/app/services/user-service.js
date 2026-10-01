const {
  User
} = require("@ecommerce/ecommerce-data-model");
const {
  hashPassword,
  comparePassword
} = require("../utils/password");

const getMyProfile = async (userId) => {
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
};

const updateMyProfile = async (
  userId,
  data
) => {
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
};
const changeMyPassword = async (
  userId,
  data
) => {
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
    await hashPassword(data.new_password);

  await user.save();

  return {
    id: user.id,
    email: user.email
  };
};
const blockUser = async (adminId, userId, isBlocked) => {
  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Prevent an admin from blocking themselves
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
};
const getAllUsers = async () => {
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
    order: [["createdAt", "DESC"]]
  });

  return users;
};
module.exports = {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  blockUser,
  getAllUsers
};