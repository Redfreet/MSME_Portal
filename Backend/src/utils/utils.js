import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const secret = process.env.SECRET_KEY;
  if (!secret) {
    // console.error("JWT Secret Key is not defined in .env file");
    throw new error("JWT Secret Key is not configured");
  }
  const token = jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });

  return token;
};
