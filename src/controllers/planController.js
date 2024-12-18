const planModel = require('../models/planModel');
// const sinchNumberModel = require('../models/sinchNumber'); // Assuming you have a model for sinch numbers
const db = require('../config/db');

// Create a new plan
const createPlan = (req, res) => {
  const { planname, description, price, call_limit, number_assign,sms_limit, data_limit, validity } = req.body;

  // Ensure all required fields are provided
  if (!planname || !description || !price || !call_limit  || !validity) {
    return res.status(400).json({ message: 'Missing required fields: planname, description, price, call_limit,number_assign, sms_limit, data_limit, validity.' });
  }

  // Additional validation (price should be a number, limits should be positive)
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ message: 'Invalid price.' });
  }

  if ([call_limit, sms_limit, data_limit].some(limit => isNaN(limit) || limit < 0)) {
    return res.status(400).json({ message: 'Limits must be positive numbers.' });
  }

  // Proceed to create the plan using the model
  planModel.createPlan(planname, description, price, call_limit,number_assign, sms_limit, data_limit, validity, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating plan', error: err.message });
    }
    res.status(200).json({ message: 'Plan created successfully', data: result });
  });
};

// Get all plans
const getPlans = (req, res) => {
  planModel.getPlans((err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching plans', error: err });
    }
    res.status(200).json({ message: 'Plans retrieved successfully', data: result });
  });
};
// Controller function to get all plans
const getAllPlans = (callback) => {
  const query = `
    SELECT
      plancode,  
      planname,
      description, 
      price, 
      call_limit
    FROM 
      tbl_plan_clay
  `;
  
  db.query(query, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    
    // Ensure the result is an array of plans and log it
    console.log('Plans result:', result);

    callback(null, result);
  });
};


// Function to fetch unallocated numbers
// Function to fetch unallocated numbers along with plan details
const getUnallocatedNumbersWithPlanDetails = (callback) => {
  const query = `
    SELECT 
      n.sinchnumberid, 
      n.plan_id, 
      n.sinch_number,
      n.plan_name,
      n.buying_price, 
      n.selling_price, 
      n.allocated,
      p.plancode,
      p.planname, 
      p.description, 
      p.price AS plan_price, 
      p.call_limit
    FROM 
      tbl_number_sinch n
    LEFT JOIN 
      tbl_plan_clay p ON n.sinchnumberid = p.plan_id
    WHERE 
      n.allocated = 0
  `;
  
  db.query(query, callback);
};

// Function to fetch number details with plan and user info
const getNumberDetailsWithPlanAndUser = (auCode, callback) => {
  const query = `
    SELECT 
      n.sinchnumberid, 
      p.plancode,
      p.planname, 
      p.price, 
      p.call_limit, 
      u.name AS user_name
    FROM 
      tbl_number_sinch n
    LEFT JOIN 
      tbl_plan_clay p ON n.plan_id = p.plan_id
    LEFT JOIN 
      users u ON n.user_id = u.id
    WHERE 
      u.aucode = ?  -- Use the auCode in the query to filter results
  `;
  
  // Execute the query with the auCode parameter
  db.query(query, [auCode], callback);
};

const purchasePlan = (req, res) => {
  const { userId, plancode } = req.body;

  if (!userId || !plancode) {
    return res.status(400).json({ message: 'userId and planId are required.' });
  }

  // Assuming sinchNumberId is part of the request or can be found via some logic
  const sinchNumberId = req.body.sinchNumberId;

  if (!sinchNumberId) {
    return res.status(400).json({ message: 'sinchNumberId is required.' });
  }

  // Query to update the sinch_number record in the database
  const query = `
    UPDATE tbl_number_sinch 
    SET plancode = ?, user_id = ?, allocated = 1 
    WHERE sinchNumberId = ? AND (plancode IS NULL OR plancode = 0);
  `;

  db.query(query, [plancode, userId, sinchNumberId], (err, results) => {
    if (err) {
      console.error('Error updating sinch_number:', err);
      return res.status(500).json({ message: 'Error allocating phone number', error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'No available number found for allocation.' });
    }

    res.status(200).json({
      message: 'Plan purchased successfully',
      allocatedPhoneNumber: sinchNumberId, // This can be the sinchNumberId or the actual phone number
    });
  });
};




module.exports = { createPlan, getPlans, purchasePlan,getUnallocatedNumbersWithPlanDetails,getNumberDetailsWithPlanAndUser,getAllPlans };
 