const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');  // To generate a JWT token for the user

const register = (req, res) => {
  // Use the correct field name from the request body (phonenumber instead of phone)
  const { name, email, phonenumber, role, document,  password,} = req.body;

  // Make sure all required arguments are passed
  if (!name || !email || !phonenumber  || !role || !document|| !password) {
    return res.status(400).json({ message: 'Missing required fields: name, email, phonenumber, password, role, and support_document are required.' });
  }

  // Call the registerUser function
  userModel.registerUser(name, email, phonenumber, role, document,password, (err, result) => {
    if (err) {
      // Check for specific error related to incorrect number of arguments for stored procedure
      if (err.message.includes('Incorrect number of arguments')) {
        return res.status(500).json({
          message: 'Error registering user',
          error: 'Incorrect number of arguments for PROCEDURE webscrap.register_user; expected 6, got 4.'
        });
      }
      
      // Handle email already registered error
      if (err.message === 'Email is already registered') {
        return res.status(400).json({ message: 'Email is already registered' });
      }

      // Handle any other database-related errors
      return res.status(500).json({ message: 'Error registering user', error: err.message });
    }

    // If no error, return success response
    res.status(200).json({ message: 'User registered successfully', data: result });
  });
};


const login = (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Call loginUser with a callback to handle the result
  userModel.loginUser(email, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging in', error: err });
    }

    // Check if user exists
    if (!result) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the password (No bcrypt hashing here, directly compare plain text)
    if (result.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token with additional fields
    const tokenPayload = {
      id: result.id,
      email: result.email,
      phonenumber: result.phonenumber,
      role: result.role,
      aucode: result.aucode,
    };

    const token = jwt.sign(tokenPayload, '123456789', { expiresIn: '1h' });

    // Get the remaining token expiry time in seconds
    const expiryTime = jwt.decode(token).exp - Math.floor(Date.now() / 1000);

    // Return the token and expiry time
    res.status(200).json({
      message: 'Login successful',
      token,
      tokenExpiry: expiryTime, // Send the remaining token expiry time in seconds
    });
  });
};

  
module.exports = { register ,login};
