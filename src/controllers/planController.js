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
    
    

    callback(null, result);
  });
};


// Function to fetch unallocated numbers
// Function to fetch unallocated numbers along with plan details
const getUnallocatedNumbersWithPlanDetails = (callback) => {
  const query = `
    SELECT 
      sinchnumberid, 
      plan_id, 
      sinch_number, 
      plan_name, 
      buying_price, 
      selling_price, 
      allocated
    FROM 
      tbl_number_sinch
    WHERE 
      allocated = 0
  `;
  
  db.query(query, callback);
};

const getNumberDetailsWithPlanAndUser = (callback) => {
  const query = `
    SELECT 
      n.sinchnumberid, 
      n.plan_id, 
      n.sinch_number, 
      n.plan_name, 
      n.buying_price, 
      n.aucode,
      n.selling_price, 
      n.allocated,
      u.name AS user_name  -- Get the name from tbl_user
    FROM 
      tbl_number_sinch n
    LEFT JOIN 
      tbl_users u ON n.aucode = u.aucode  -- Join on aucode
    WHERE 
      n.allocated = 1
  `;

  db.query(query, callback);
};


const purchasePlan = (req, res) => {
  const { aucode, plancode } = req.body; // Use aucode instead of userId

  if (!aucode || !plancode) {
    return res.status(400).json({ message: 'aucode and plancode are required.' });
  }

  // Assuming sinchNumberId is part of the request or can be found via some logic
  const sinchNumberId = req.body.sinchNumberId;

  if (!sinchNumberId) {
    return res.status(400).json({ message: 'sinchNumberId is required.' });
  }

  // Query to update the sinch_number record in the database
  const query = `
    UPDATE tbl_number_sinch 
    SET plancode = ?, aucode = ?, allocated = 1 
    WHERE sinchNumberId = ? AND (plancode IS NULL OR plancode = 0);
  `;

  db.query(query, [plancode, aucode, sinchNumberId], (err, results) => {
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
  