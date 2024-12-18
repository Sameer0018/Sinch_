const jwt = require('jsonwebtoken');
const secretKey = '123456789'; // Replace with a more secure secret in production

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided, access denied.' });
  }

  // Remove 'Bearer ' if it is included in the token
  const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;

  console.log("Token received: ", tokenWithoutBearer); // Log the token for debugging (be cautious with production)

  jwt.verify(tokenWithoutBearer, secretKey, (err, decoded) => {
    if (err) {
      console.log("JWT verification error: ", err);  // Log error details
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Log the decoded user info for debugging
    console.log("Decoded token data: ", decoded);

    // Save the decoded user info (including role) to the request object
    req.user = decoded;
    next();
  });
};


// Middleware to check if the user has admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};
// Middleware to check if the user has isUser role
const isUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Forbidden: User only' });
  }
  next();
};

module.exports = { verifyToken, isAdmin ,isUser};
