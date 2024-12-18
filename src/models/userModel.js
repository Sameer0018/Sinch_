const db = require('../config/db');

// Function to register a new user
const registerUser = (name, email, phone, password, role, document, callback) => {
  const query = `CALL register_user(?, ?, ?, ?, ?, ?)`;
  db.query(query, [name, email, phone, password, role, document], callback);
};

// Function to update user profile
const updateUserProfile = (userId, name, email, phone, callback) => {
  const query = `CALL update_user_profile(?, ?, ?, ?)`;
  db.query(query, [userId, name, email, phone], callback);
};

// Function to fetch a specific user profile by ID
const getUserProfile = (userId, callback) => {
  const query = `SELECT id, name, email, phone_number AS phone, password, aucode FROM tbl_users WHERE id = ?`;
  db.query(query, [userId], callback);
};

// Function to fetch all users
const getAllUsers = () => {
  const sqlQuery = 'SELECT id, name, email, phonenumber AS phone, password FROM tbl_users';
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, (err, result) => {
      if (err) return reject(err);
      resolve(result); // Return all user records
    });
  });
};

// Function to fetch a specific user by ID
const getUserById = (userId) => {
  const sqlQuery = 'SELECT id, name, email, phonenumber AS phone, password FROM tbl_users WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(sqlQuery, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]); // Return the single user record
    });
  });
};

// Function to fetch user by email (for login purposes)
const loginUser = (email, callback) => {
  const query = 'SELECT * FROM tbl_users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) {
      return callback(err, null);
    }

    // If user is not found, return null
    if (result.length === 0) {
      return callback(null, null);
    }

    // Return the user object
    return callback(null, result[0]);
  });
};

module.exports = {
  registerUser,
  updateUserProfile,
  getUserProfile,
  loginUser,
  getUserById,
  getAllUsers, // Ensure this is included
};
