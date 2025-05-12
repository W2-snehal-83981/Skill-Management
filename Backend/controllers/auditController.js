const pool = require('../config/db');
const authenticateJWT = require('../middleware/authMiddleware');

// exports.auditRecord = async (req, res) => {
//   const { emp_id, field_changed, old_value, new_value, changed_by, description } = req.body;

//   // Validate input fields
//   if (!emp_id || !field_changed || !old_value || !new_value || !changed_by) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     await pool.query(`
//       INSERT INTO Audit (emp_id, field_changed, old_value, new_value, changed_by, description)
//       VALUES ($1, $2, $3, $4, $5, $6)
//     `, [emp_id, field_changed, old_value, new_value, changed_by, description]);

//     res.status(201).json({ message: "Audit record inserted successfully" });
//   } catch (err) {
//     console.error("Error inserting audit record:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };

exports.auditRecord = async (req,res) => {
  try {
    console.log('audit');
    const result = await pool.query(`--SELECT * FROM Audit;
SELECT
        e.emp_id,
        e.name,
        e.skill,
        e.skill_level,
        ta.training_link,
        a.change_time AS training_completion_time
      FROM
        employee e
      JOIN
        training_assign ta ON e.skill = ta.skill_name AND e.skill_level = ta.skill_level
      JOIN
        audit a ON e.emp_id = a.emp_id
      WHERE
        a.change_time = (
          SELECT MAX(change_time)
          FROM audit
          WHERE emp_id = e.emp_id
        )
        AND e.status = 'Completed'
        AND e.isdeleted = FALSE
      ORDER BY e.emp_id;
	  `);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No record found' });
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};


