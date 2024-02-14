import jwt from "jsonwebtoken";
const createJwt = (userEmail) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  const payload = {
    user: {
      email: userEmail,
    },
  };
  const token = jwt.sign(payload, jwtSecretKey, { expiresIn: "10d" });
  return token;
};
export { createJwt };
