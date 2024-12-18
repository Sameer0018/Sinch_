const db = require('../config/db');

const createPlan = (planName, description, price, call_limit,number_assign,sms_limit, data_limit, validity, callback) => {
  const query = `CALL create_plan(?, ?, ?, ?, ?, ?, ?,?)`;
  db.query(query, [planName, description, price, call_limit, number_assign,sms_limit, data_limit, validity], (err, result) => {
    if (err) {
      // Log the error for debugging
      console.error('Error executing query', err);
      return callback(err, null); // Pass error to the callback
    }
    callback(null, result);
  });
};
// Function to get all plans
const getPlans = (callback) => {
  const query = `SELECT planname, description, price, call_limit, sms_limit, ,number_assign,data_limit, validity FROM tbl_plan_clay`;
  db.query(query, callback);
};

module.exports = { createPlan, getPlans };
