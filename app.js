const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

// Remove or comment out the database connection logic temporarily to avoid the timeout error.
try {
  // Your DB connection logic here if needed later
  // For example: connectToDatabase();
  console.log("Database connection attempt skipped for now.");
} catch (error) {
  console.error("Error connecting to the database: ", error);
}

// Define your routes
app.get('/', (req, res) => {
  res.send('Hello Sameer SDE-1');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
