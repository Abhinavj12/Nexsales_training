const {
  generateVerificationToken,
  hashVerificationToken
} = require("./app/utils/verification-token");

const test = () => {
  const result = generateVerificationToken();

  console.log(
    "Raw token length:",
    result.rawToken.length
  );

  console.log(
    "Token hash length:",
    result.tokenHash.length
  );

  console.log(
    "Expires at:",
    result.expiresAt.toISOString()
  );

  const hashAgain = hashVerificationToken(
    result.rawToken
  );

  console.log(
    "Hash matches:",
    hashAgain === result.tokenHash
  );
};

test();