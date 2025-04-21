const pool = require('../config/db');

exports.auditRecord = async (req, res) => {
  const { emp_id, field_changed, old_value, new_value, changed_by, description } = req.body;

  // Validate input fields
  if (!emp_id || !field_changed || !old_value || !new_value || !changed_by) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await pool.query(`
      INSERT INTO Audit (emp_id, field_changed, old_value, new_value, changed_by, description)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [emp_id, field_changed, old_value, new_value, changed_by, description]);

    res.status(201).json({ message: "Audit record inserted successfully" });
  } catch (err) {
    console.error("Error inserting audit record:", err.message);
    res.status(500).json({ error: err.message });
  }
};
