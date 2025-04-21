const pool = require('../config/db');

exports.addEmployee = async(req,res) => {
    const {emp_id,name,email,password,role,doj,department_id,primary_skill_id,secondary_skill_id} = req.body;

    try{
        const result = await pool.query(
            `insert into Employee (emp_id,name,email,password,role,doj,department_id,primary_skill_id,secondary_skill_id) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [emp_id,name,email,password,role,doj,department_id,primary_skill_id,secondary_skill_id]
        );
        res.status(201).json(result.rows[0]);
    } catch(error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
};

exports.getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        `SELECT * FROM Employee WHERE emp_id = $1 AND isDeleted = false`,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Employee not found or has been deleted' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };

exports.getAllEmployee = async(req,res) => {
    const {id} = req.params;
    try{
        const result = await pool.query (`select * from Employee where isDeleted=false`);

        if(result.rows.length === 0){
            return res.status(404).json({message: 'Employee not found'});
        }
        res.json(result.rows[0]);
    } catch(error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
};

exports.updateEmployee = async (req,res) => {
    const {id} = req.params;
    const {department_id,primary_skill_id,secondary_skill_id} = req.body;

    try{
        const result = await pool.query(
            `update Employee set department_id=$1,primary_skill_id=$2,secondary_skill_id=$3 where emp_id=$4 RETURNING *`,[department_id,primary_skill_id,secondary_skill_id,id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({message:'Employee not found'});
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        `UPDATE Employee SET isDeleted = true WHERE emp_id = $1 RETURNING *`,
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.json({ message: 'Employee deleted successfully', employee: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
 
  
  exports.restoreEmployee = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        `UPDATE Employee SET isDeleted = false WHERE emp_id = $1 RETURNING *`,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Employee not found or not deleted' });
      }
      res.json({ message: 'Employee restored successfully', employee: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  