require('dotenv').config(); 
const pool = require('../config/db');
const jwtSecret = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
console.log('JWT Secret Key:', jwtSecret);




//to get the all employees where isDeleted=false AND role = employee
exports.getEmployees =  async (req,res) =>{
    try{
        const result = await pool.query(
            `SELECT
             e.emp_id AS "EmployeeID",
             e.name AS "EmployeeName",
             e.skill AS "Skill",
             e.skill_level AS "SkillLevel",
             e.date_of_joining AS "DateOfJoining",
             e.department_name AS "DepartmentName",
             e.skill_category AS "SKillCategory",
             ta.training_link AS "AssignedTrainingLink",
             e.status AS "Status"
         FROM
             Employee e
         LEFT JOIN
             Training_Assign ta ON e.skill = ta.skill_name AND e.skill_level = ta.skill_level
	     WHERE
             e.role = 'Employee' AND e.is_deleted = FALSE
             ORDER BY e.emp_id;`
        );

        if(result.rows.length === 0){
            return res.status(404).json({ message: "Employees Not Found"});
        }

        res.json(result.rows);

    }catch(err){
        console.error(err.message);
        res.status(500).json({ error: err.message })

    }
};



//to get the single employee by using there emp_id
exports.getEmployeeByIdWithTraining = async (req, res) => {
    const { emp_id } = req.params; 
  
    try {
      const result = await pool.query(
        `
        SELECT
          e.emp_id,
          e.name,
          e.skill,
          e.skill_level,
          e.date_of_joining,
          e.department_name,
          e.skill_category,
          ta.training_link,
          e.status
        FROM
          employee e
        LEFT JOIN
          training_assign ta ON e.skill = ta.skill_name AND e.skill_level = ta.skill_level
        WHERE
          e.emp_id = $1;
        `,
        [emp_id] // Pass the employee ID as a parameter
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Employee not found or is deleted" });
      }
  
      res.json(result.rows[0]); 
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: err.message });
    }
};



//to soft delete employee for the employee table.
exports.deleteEmployeeAdmin = async (req, res) => {
    const { emp_id } = req.params;
    console.log(emp_id);
  
    try {
      const employeeCheck = await pool.query(
        `SELECT * FROM employee WHERE emp_id = $1 AND is_deleted = false`,
        [emp_id]
      );
      if (employeeCheck.rowCount === 0) {
        return res.status(404).json({ message: "Employee not found or already deleted" });
      }
  
      // Soft delete the employee by updating isDeleted flag
      await pool.query(`UPDATE Employee SET is_deleted = true WHERE emp_id = $1`, [emp_id]);
      res.json({ message: "Employee soft deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};



exports.updateEmployeeSkill = async ( req,res) =>{
    const { emp_id } = req.params;
    const { newSkill,newSkillLevel} = req.body;

    try{
        const tResult = await pool.query(
            `SELECT 1 FROM training_assign WHERE skill_name = $1 AND skill_level = $2`,
            [newSkill, newSkillLevel]
        );

        if(tResult.rows.length === 0){
            return res.status(400).json({
                error: 'Skill And Skill Level Does Not Found'
            });
        }

        const updateResult = await pool.query(
            `UPDATE employee
             SET skill = $1, skill_level = $2
             WHERE emp_id = $3`,
            [newSkill,newSkillLevel,emp_id]
        );

        if (updateResult.rowCount > 0) {
            res.json({ message: 'Employee skill updated successfully.' });
          } else {
            res.status(404).json({ message: 'Employee not found.' });
          }

    }catch(err){
        console.error('Error updating employee skill:', error);
        res.status(500).send('Server Error');

    }

};


exports.adminlevelInc = async (req, res) => {
    const { emp_id} = req.params; // Get the emp_id from the route parameter
  
    try {
      const updateResult = await pool.query(
        `
        UPDATE employee
        SET skill_level =
          CASE
            WHEN skill_level = 'Beginner' THEN 'Intermediate'
            WHEN skill_level = 'Intermediate' THEN 'Advanced'
            ELSE skill_level
          END
        WHERE emp_id = $1;
        `,
        [emp_id] // Use the emp_id as a parameter
      );
  
      if (updateResult.rowCount > 0) {
        res.json({ message: `Skill level updated for employee ${emp_id}.` });
      } else {
        res.status(404).json({ message: `Employee with ID ${emp_id} not found.` });
      }
  
    } catch (error) {
      console.error(`Error incrementing skill level for employee ${employeeId}:`, error);
      res.status(500).send('Server Error');
    }
};

exports.getComTraining = async ( req, res) =>{
    try{
     const result = await pool.query(`
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
        AND e.is_deleted = FALSE
      ORDER BY e.emp_id;
        `);

        res.json(result.rows);

    }catch(err){
        console.error('Error fetching completed employee trainings:', error);
        res.status(500).send('Server Error');

    }
};


exports.getComTrainingById = async (req , res) =>{
  const { emp_id }= req.params;

  try{
    const result = await pool.query(
  `SELECT
    e.emp_id,
    e.name,
    e.skill,
    e.skill_level,
    ta.training_link,
    a.change_time AS training_completion_time
   FROM
    employee e
  JOIN
    Training_Assign ta ON e.skill = ta.skill_name AND e.skill_level = ta.skill_level
  JOIN
    audit a ON e.emp_id = a.emp_id
  WHERE
    a.change_time = (
        SELECT MAX(change_time)
        FROM audit
        WHERE  emp_id = $1
    )
  AND e.status = 'Completed';
      `,
      [emp_id]
    );

    const trainingData  = result.rows[0];

    if(trainingData){
      res.json(trainingData);
    }else{
      res.status(404).json({ message: `No Complete Training found for employee ${emp_id}`});
    }

  }catch(error){
    console.error('Error fetching completed training for employee:', error);
    res.status(500).send('Server Error');

  }
};

exports.changePassword = async (req, res) => {
  const { emp_id } = req.params;
  const { old_password, new_password } = req.body;

  try {
    const employeeResult = await pool.query(
      'SELECT password FROM employee WHERE emp_id = $1',
      [emp_id]
    );

    if (employeeResult.rows.length === 0) {
      return res.status(404).json({ message: `Employee with ID ${emp_id} not found` });
    }

    const currentHashedPassword = employeeResult.rows[0].password;

    const isMatch = await bcrypt.compare(old_password, currentHashedPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const isSame = await bcrypt.compare(new_password, currentHashedPassword);
    if (isSame) {
      return res.status(400).json({ message: 'New password must be different from the old password' });
    }

    const hashedNewPassword = await bcrypt.hash(new_password, 5);

    await pool.query(
      'UPDATE employee SET password = $1 WHERE emp_id = $2',
      [hashedNewPassword, emp_id]
    );

    res.status(200).json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: error.message });
  }
};