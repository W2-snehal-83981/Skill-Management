const pool = require('../config/db');


// Get Employee Profile by emp_id
exports.getEmployeeProfile = async (req, res) => {
  const { emp_id } = req.params;  // Get emp_id from request params

  try {
    const result = await pool.query(`
      SELECT 
        e.emp_id AS "EmployeeID", 
        e.name AS "EmployeeName", 
        e.department_name AS "DepartmentName",  
        e.skill AS "PrimarySkill", 
        e.skill_level AS "SkillLevel"
      FROM 
        Employee e
      WHERE
        e.emp_id = $1 AND e.isDeleted = false;
    `, [emp_id]);  // Pass emp_id as a parameter to prevent SQL injection

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found or is deleted" });
    }

    res.json(result.rows[0]); 
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};


exports.getEmployee = async (req, res) => {
 // console.log("🔍 getEmployees route hit");
  try {
    const result = await pool.query(`
      SELECT 
        e.emp_id AS "EmployeeID", 
        e.name AS "EmployeeName", 
        e.department_name AS "DepartmentName",  
        e.skill AS "PrimarySkill", 
        e.skill_level AS "SkillLevel"
      FROM 
        Employee e
     
    `); 
   // console.log("📦 Query result:", result.rows);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(result.rows); 
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};


// Update employee
exports.updateEmployee = async (req, res) => {
  const { emp_id } = req.params;
  const {name, email, department_name, skill_category, skill,skill_level, status} = req.body;
  console.log(emp_id);
  try {
    const employeeCheck = await pool.query(
      `SELECT * FROM Employee WHERE emp_id = $1 AND isDeleted = false`,
      [emp_id]
    );
    if (employeeCheck.rowCount === 0) {
      return res.status(404).json({ message: "Employee not found or already deleted" });
    }

    await pool.query(`UPDATE Employee SET name=$1, email=$2, department_name=$3, skill_category=$4, skill=$5, skill_level=$6, status=$7 WHERE emp_id=$8`,
       [name, email, department_name, skill_category, skill,skill_level, status,emp_id]);
       
   
    res.json({ message: "Employee updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Soft delete employee (update isDeleted to true)
exports.deleteEmployee = async (req, res) => {
  const { emp_id } = req.params;
  console.log(emp_id);

  try {
    const employeeCheck = await pool.query(
      `SELECT * FROM Employee WHERE emp_id = $1 AND isDeleted = false`,
      [emp_id]
    );
    if (employeeCheck.rowCount === 0) {
      return res.status(404).json({ message: "Employee not found or already deleted" });
    }

    // Soft delete the employee by updating isDeleted flag
    await pool.query(`UPDATE Employee SET isDeleted = true WHERE emp_id = $1`, [emp_id]);
    res.json({ message: "Employee soft deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//To show the data Admin Dashboard
exports.getEmployeeWithTraining = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.emp_id AS "EmployeeID", 
        e.name AS "EmployeeName", 
        e.department_name AS "DepartmentName",  
        e.skill AS "PrimarySkill", 
        e.skill_level AS "SkillLevel", 
        e.date_of_joining AS "DateOfJoining", 
        ta.training_link AS "AssignedTrainingLink", 
        e.status AS "Status"
      FROM 
        Employee e
      LEFT JOIN 
        Training_Assign ta ON e.skill = ta.skill_name 
        AND e.skill_level = ta.skill_level
      WHERE
        e.isDeleted = false
      ORDER BY 
        e.emp_id;
    `);

    res.json(result.rows);  // Send back the query result
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

//for audit table entry
// exports.updateEmployee = async (req, res) => {
//   const { emp_id } = req.params;  // Get employee ID from the request params
//   const { name, email, department_name, skill_category, skill, skill_level, status } = req.body;
  
//   console.log('Emp ID:', emp_id);  // Log emp_id for verification

//   try {
//     // Step 1: Fetch the current employee record to compare with new values
//     const employeeCheck = await pool.query(
//       `SELECT * FROM Employee WHERE emp_id = $1 AND isDeleted = false`,
//       [emp_id]
//     );

//     if (employeeCheck.rowCount === 0) {
//       return res.status(404).json({ message: "Employee not found or already deleted" });
//     }

//     // Step 2: Get the old values (for audit purposes)
//     const oldValues = employeeCheck.rows[0];

//     // Prepare to update employee data
//     const updateQuery = `
//       UPDATE Employee
//       SET 
//         name=$1,
//         email=$2,
//         department_name=$3,
//         skill_category=$4,
//         skill=$5,
//         skill_level=$6,
//         status=$7
//       WHERE emp_id=$8
//     `;

//     await pool.query(updateQuery, [name, email, department_name, skill_category, skill, skill_level, status, emp_id]);

//     // Step 3: Log changes to the Audit table
//     const changes = [];

//     // Compare old values with new values, and insert into the Audit table if different
//     if (oldValues.name !== name) {
//       changes.push({ field: 'name', old: oldValues.name, new: name });
//     }
//     if (oldValues.email !== email) {
//       changes.push({ field: 'email', old: oldValues.email, new: email });
//     }
//     if (oldValues.department_name !== department_name) {
//       changes.push({ field: 'department_name', old: oldValues.department_name, new: department_name });
//     }
//     if (oldValues.skill_category !== skill_category) {
//       changes.push({ field: 'skill_category', old: oldValues.skill_category, new: skill_category });
//     }
//     if (oldValues.skill !== skill) {
//       changes.push({ field: 'skill', old: oldValues.skill, new: skill });
//     }
//     if (oldValues.skill_level !== skill_level) {
//       changes.push({ field: 'skill_level', old: oldValues.skill_level, new: skill_level });
//     }
//     if (oldValues.status !== status) {
//       changes.push({ field: 'status', old: oldValues.status, new: status });
//     }

//     // Insert changes into the Audit table
//     for (const change of changes) {
//       await pool.query(`
//         INSERT INTO Audit (emp_id, field_changed, old_value, new_value, changed_by, description)
//         VALUES ($1, $2, $3, $4, $5, $6)
//       `, [emp_id, change.field, change.old, change.new, 'admin', `Updated ${change.field} from ${change.old} to ${change.new}`]);
//     }

//     // Step 4: Send a response to the client
//     res.json({ message: "Employee updated and audit log inserted successfully" });
    
//   } catch (err) {
//     console.error("Error updating employee:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };
