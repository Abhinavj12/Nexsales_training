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

const {
  sendVerificationEmail,
  sendPasswordResetEmail
} = require("../../../services/mail-service");

const {
  generateAccessToken
} = require("../../../utils/jwt");

const {
  generatePasswordResetToken,
  hashPasswordResetToken
} = require("../../../utils/password-reset-token");

// ============================================================
// REGISTER
// ============================================================

const register = async (data) => {
  const {
    first_name,
    last_name,
    email,
    password
  } = data;

  const existingUser = await User.findOne({
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

  const password_hash = await hashPassword(password);

  const user = await User.create({
    first_name,
    last_name,
    email,
    password_hash
  });

  try {
    const {
      rawToken,
      tokenHash,
      expiresAt
    } = generateVerificationToken();

    await EmailVerificationToken.create({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt
    });

    await sendVerificationEmail({
      email: user.email,
      firstName: user.first_name,
      verificationToken: rawToken
    });
  } catch (error) {
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
};
//==============================
//admin-only endpoint
//==============================
const createAdmin = async (data) => {
  const {
    first_name,
    last_name,
    email,
    password
  } = data;

  const existingUser = await User.findOne({
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

  const password_hash =
    await hashPassword(password);

  const user = await User.create({
    first_name,
    last_name,
    email,
    password_hash,
    role: "ADMIN"
  });

  try {
    const {
      rawToken,
      tokenHash,
      expiresAt
    } = generateVerificationToken();

    await EmailVerificationToken.create({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt
    });

    await sendVerificationEmail({
      email: user.email,
      firstName: user.first_name,
      verificationToken: rawToken
    });
  } catch (error) {
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
};
// ============================================================
// VERIFY EMAIL
// ============================================================

const verifyEmail = async (rawToken) => {
  if (!rawToken) {
    const error = new Error(
      "Verification token is required"
    );

    error.statusCode = 400;

    throw error;
  }

  const tokenHash =
    hashVerificationToken(rawToken);

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

  if (!verificationToken) {
    const error = new Error(
      "Invalid verification token"
    );

    error.statusCode = 400;

    throw error;
  }

  if (verificationToken.used_at) {
    const error = new Error(
      "Verification token has already been used"
    );

    error.statusCode = 400;

    throw error;
  }

  if (new Date() > verificationToken.expires_at) {
    const error = new Error(
      "Verification token has expired"
    );

    error.statusCode = 400;

    throw error;
  }

  const user = verificationToken.user;

  if (!user) {
    const error = new Error(
      "Associated user was not found"
    );

    error.statusCode = 400;

    throw error;
  }

  const transaction =
    await sequelize.transaction();

  try {
    user.is_verified = true;

    await user.save({
      transaction
    });

    verificationToken.used_at = new Date();

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
};

//Login
const login=async(data)=>{
  const {
    email,
    password
  } =data;

  //Find user
  const user=await User.findOne({
    where:{
      email
    }
  });

  //if user not exits throw error
  if(!user){
    const error=new Error(
      "Invalid email or Password"
    );
    error.statusCode=401;
    throw error;
  }
  // checking account is block or not
  if (user.is_blocked) {
    const error = new Error(
      "Your account has been blocked"
    );

    error.statusCode = 403;

    throw error;
  }
  //checking whether user is verified or not
  if (!user.is_verified) {
    const error = new Error(
      "Please verify your email before logging in"
    );

    error.statusCode = 403;

    throw error;
  }
  // Finaly checking password
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

  //genrate jwt
   const accessToken =
    generateAccessToken(user);

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

};
const forgotPassword = async (email) => {
  const user = await User.findOne({
    where: {
      email
    }
  });

  
  if (!user) {
    return;
  }

  // cleanup:
  // invalidate previous unused reset tokens
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

  const {
    rawToken,
    tokenHash,
    expiresAt
  } = generatePasswordResetToken();

  await PasswordResetToken.create({
    user_id: user.id,
    token_hash: tokenHash,
    expires_at: expiresAt
  });

  await sendPasswordResetEmail({
    email: user.email,
    firstName: user.first_name,
    resetToken: rawToken
  });
};
const resetPassword = async ({
  token,
  password
}) => {
  // 1. Token is required
  if (!token) {
    const error = new Error(
      "Password reset token is required"
    );

    error.statusCode = 400;

    throw error;
  }

  // 2. Hash the token received from the client
  const tokenHash =
    hashPasswordResetToken(token);

  // 3. Find reset token
  const resetToken =
    await PasswordResetToken.findOne({
      where: {
        token_hash: tokenHash
      }
    });

  // 4. Invalid token
  if (!resetToken) {
    const error = new Error(
      "Invalid password reset token"
    );

    error.statusCode = 400;

    throw error;
  }

  // 5. Token already used
  if (resetToken.used_at) {
    const error = new Error(
      "Password reset token has already been used"
    );

    error.statusCode = 400;

    throw error;
  }

  // 6. Token expired
  if (
    new Date() > resetToken.expires_at
  ) {
    const error = new Error(
      "Password reset token has expired"
    );

    error.statusCode = 400;

    throw error;
  }

  // 7. Find associated user
  const user = await User.findByPk(
    resetToken.user_id
  );

  if (!user) {
    const error = new Error(
      "Associated user was not found"
    );

    error.statusCode = 400;

    throw error;
  }

  // 8. Hash new password
  const password_hash =
    await hashPassword(password);

  // 9. Update password + consume token
  const transaction =
    await sequelize.transaction();

  try {
    user.password_hash = password_hash;

    await user.save({
      transaction
    });

    resetToken.used_at = new Date();

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
};
module.exports = {
  register,
  createAdmin,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
};