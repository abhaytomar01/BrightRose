// controllers/user/addressController.js
import User from "../../models/userModel.js";

// GET all addresses for logged-in user
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("addresses");
    return res.status(200).send({ success: true, addresses: user?.addresses || [] });
  } catch (err) {
    console.error("getAddresses err:", err);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

// ADD new address
export const addAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { label, name, phone, address, city, state, pincode, default: isDefault } = req.body;

    if (!name || !phone || !address || !city || !state || !pincode) {
      return res.status(400).send({ success: false, message: "Please provide all required fields" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ success: false, message: "User not found" });

    // If new address marked default, unset other defaults
    if (isDefault) {
      user.addresses.forEach(a => (a.default = false));
    }

    user.addresses.push({
      label: label || "Home",
      name,
      phone,
      address,
      city,
      state,
      pincode,
      default: !!isDefault,
    });

    await user.save();

    return res.status(201).send({ success: true, message: "Address added", addresses: user.addresses });
  } catch (err) {
    console.error("addAddress err:", err);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

// UPDATE address by subdocument id
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;
    const update = req.body; // label, name, phone, address, city, state, pincode, default

    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ success: false, message: "User not found" });

    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).send({ success: false, message: "Address not found" });

    // If setting default, unset others
    if (update.default) {
      user.addresses.forEach(a => (a.default = false));
    }

    Object.assign(addr, update);
    await user.save();

    return res.status(200).send({ success: true, message: "Address updated", addresses: user.addresses });
  } catch (err) {
    console.error("updateAddress err:", err);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

// DELETE address
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ success: false, message: "User not found" });

    const addr = user.addresses.id(addressId);
    if (!addr) return res.status(404).send({ success: false, message: "Address not found" });

    addr.remove();
    await user.save();

    return res.status(200).send({ success: true, message: "Address deleted", addresses: user.addresses });
  } catch (err) {
    console.error("deleteAddress err:", err);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

// Set default (alternative endpoint) — PUT /address/:addressId/default
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ success: false, message: "User not found" });

    user.addresses.forEach(a => (a.default = a._id.toString() === addressId));
    await user.save();

    return res.status(200).send({ success: true, message: "Default address set", addresses: user.addresses });
  } catch (err) {
    console.error("setDefaultAddress err:", err);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};
