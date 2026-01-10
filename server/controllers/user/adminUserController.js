// server/controllers/user/adminUserController.js
import User from "../../models/userModel.js";

export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("_id name email phone createdAt isBlocked role")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("ADMIN GET USERS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
};
