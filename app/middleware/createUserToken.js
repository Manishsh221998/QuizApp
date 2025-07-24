const jwt = require("jsonwebtoken");

const generateUserToken = async (data) => {
  const token = await jwt.sign(
    {
      userId: data._id,
      name: data.name,
      email: data.email,
      image: data.image,
      roleId: data.roleId,
      role: data.roleName,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30m" }
  );
  return token;
};

module.exports = generateUserToken;
