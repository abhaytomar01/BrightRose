export const adminLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Only admin allowed
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }

    // IMPORTANT: password field name
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Admin login successful",
      token,
      user,
    });

  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);   // ⬅ ADDED
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};
