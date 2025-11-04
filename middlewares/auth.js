import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.accesstoken || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        message: "Provide token",
        error: true,
        success: false,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token",
        error: true,
        success: false,
      });
    }

    // ✅ Fetch user from DB
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // ✅ Attach user to request
    req.user = user;
    req.userId = user._id; // for backward compatibility

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export default auth;