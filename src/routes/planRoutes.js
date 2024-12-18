const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { verifyToken, isAdmin,isUser } = require('../middlewares/verifyToken');  // Import the middleware
// Route to get all plans
router.get('/', planController.getPlans);


// Route to create a new plan (Admin Only)
router.post('/create', verifyToken, isUser, planController.createPlan);
// Route to get all plans
router.get('/plans', (req, res) => {
    planController.getAllPlans((err, result) => {
      if (err) {
        console.error('Error fetching plans:', err);
        return res.status(500).json({ error: 'Failed to fetch plans' });
      }
  
      // Log the result to check if plan_id is included
      console.log('Plans fetched:', result);
  
      res.status(200).json(result); // Send the result (list of plans) as response
    });
  });
  
  
router.post('/purchase', planController.purchasePlan);

// Route to get unallocated numbers with plan details
router.get('/unallocated-numbers', (req, res) => {
    planController.getUnallocatedNumbersWithPlanDetails((err, result) => {
      if (err) {
        console.error('Error fetching unallocated numbers with plan details:', err);
        return res.status(500).json({ error: 'Failed to fetch unallocated numbers with plan details' });
      }
      res.status(200).json(result); // Send result as response
    });
  });
// Route to get number details with plan and user information
router.get('/number-details',  (req, res) => {
    // Extract 'aucode' from the request headers
    
    planController.getNumberDetailsWithPlanAndUser( (err, result) => {
      if (err) {
        console.error('Error fetching number details with plan and user info:', err);
        return res.status(500).json({ error: 'Failed to fetch number details' });
      }
      res.status(200).json(result); // Send result as response
    });
  });
  
module.exports = router;
