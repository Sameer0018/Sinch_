// app.js
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors


dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));


app.use(bodyParser.json());

const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const planRoutes = require('./src/routes/planRoutes');

app.use('/api', authRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes); 
app.use('/api/plan', planRoutes);
// New route for /testingsinch
app.get('/', (req, res) => {
  res.send('Hello Sameer SDE-1');
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

