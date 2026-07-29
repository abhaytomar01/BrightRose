// Add to existing userController.js
import User from "../../models/userModel.js";
import { verifyToken } from "../middleware/auth.js"; // Assume exists

// GET /api/v1/user/addresses
export const getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.json({ success: true, addresses: user.addresses || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch addresses' });
  }
};

// POST /api/v1/user/addresses (add new)
export const addUserAddress = async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode, isDefault } = req.body;
    const user = await User.findById(req.user._id);
    const newAddr = { name, phone, address, city, state, pincode, isDefault: isDefault || false };
    
    user.addresses.push(newAddr);
    if (newAddr.isDefault || !user.addresses.some(a => a.isDefault)) {
      user.addresses.forEach(a => a.isDefault = false);
      newAddr.isDefault = true;
    }
    
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add address' });
  }
};

// PUT /api/v1/user/addresses/:addrId (update)
export const updateUserAddress = async (req, res) => {
  try {
    const { addrId } = req.params;
    const updates = req.body;
    const user = await User.findById(req.user._id);
    
    const addrIndex = user.addresses.findIndex(a => a._id.toString() === addrId);
    if (addrIndex === -1) return res.status(404).json({ success: false, message: 'Address not found' });
    
    user.addresses[addrIndex] = { ...user.addresses[addrIndex], ...updates };
    if (updates.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
      user.addresses[addrIndex].isDefault = true;
    }
    
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update address' });
  }
};

// DELETE /api/v1/user/addresses/:addrId
export const deleteUserAddress = async (req, res) => {
  try {
    const { addrId } = req.params;
    const user = await User.findById(req.user._id);
    
    user.addresses = user.addresses.filter(a => a._id.toString() !== addrId);
    if (!user.addresses.some(a => a.isDefault) && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete address' });
  }
};
