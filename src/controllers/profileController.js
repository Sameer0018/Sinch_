// controllers/profileController.js
const db = require('../config/db');  // Adjust the path to match where your db.js file is located

const userModel = require('../models/userModel');

const updateProfile = (req, res) => {
  const { userId, name, email, phone } = req.body;

  userModel.updateUserProfile(userId, name, email, phone, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating profile', error: err });
    }
    res.status(200).json({ message: 'Profile updated successfully', data: result });
  });
};
// Fetch user profile by ID or all users
const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = userId 
      ? await userModel.getUserById(userId) 
      : await userModel.getAllUsers();

    if (userId && !result) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: userId ? 'Profile retrieved successfully' : 'All profiles retrieved successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile(s)', error });
  }
};

  module.exports = { updateProfile,getProfile };
