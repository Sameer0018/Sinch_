const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { getAllUsers, getUserById } = require('../models/userModel'); // Adjust path if necessary

// Route to update profile
router.put('/update', profileController.updateProfile);

// New route to get profile data
// Fetch all profiles if no userId is provided
// Define routes
router.get('/:userId?', async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (userId) {
        const user = await getUserById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User retrieved successfully', data: user });
      }
  
      const users = await getAllUsers();
      res.status(200).json({ message: 'All users retrieved successfully', data: users });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users', error });
    }
  });
  
module.exports = router;
