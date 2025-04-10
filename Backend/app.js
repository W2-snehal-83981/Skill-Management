const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//db connection
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    port: 5432,
    database: "SkillManagement",
    password: "password",
});

const SECRET_KEY = 'CrossCountryInfotech';

app.post("/login",async(req,res) => {
  const {email,password} = req.body;

  try{
    const result = await pool.query(`select * from Employee where email=$1 AND isDeleted=$2`,[email,false]);
    console.log("Database result:", result.rows);

    if (result.rows.length === 0) {
      return res.status(400).send("Employee not found!");
    }

    const employee = result.rows[0];

    // Compare the password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    //creating JWT token using sign(payload+secretkey+expiresIn)
    const token = jwt.sign(
      {EmpId:employee.emp_id, email:employee.email, role:employee.role},
      SECRET_KEY,
      {expiresIn: '1h'}
    );

    if(employee.role === 'admin'){
       res.json({
        message:"Admin login successful!",
        role: employee.role,
        empData: employee,
        token
       });
    }
    else if(employee.role === 'employee'){
      res.json ({
        message: "Employee Login Successful!",
        role: employee.role,
        empData:employee,
        token
      });
    }
    else{
      return res.status(400).send("Invalid role");
    }
  }catch (error){
    console.error(error);
    res.status(500).send("Server Error");
  }
});


//****************************************************************Employee******************************************************************
//fetch all employees
app.get("/employee", async(req,res) => {
    try{
        const result = await pool.query (`select * from Employee where isDeleted=false`);

        if(result.rows.length === 0){
            return res.status(404).json({message: 'Employee not registered yet'});
        }
        res.json(result.rows);
    } catch(error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
});

//fetch employee by Id
app.get("/employee/:id" ,async (req, res) => {
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
});

//add new employee
app.post("/employee/add"  ,async(req,res) => {
    const {emp_id,name,email,password,role,doj,department_id,primary_skill_id,secondary_skill_id} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);

    try{
        const result = await pool.query(
            `insert into Employee (emp_id,name,email,password,role,doj,department_id,primary_skill_id,secondary_skill_id) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [emp_id,name,email,hashedPassword,role,doj,department_id,primary_skill_id,secondary_skill_id]
        );
        res.status(201).json(result.rows[0]);
    } catch(error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
});

//delete existing employee
app.delete("/employee/deleteemp/:id", async (req, res) => {
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
});

//activate the user who is deleted
app.put("/employee/activate/:id", async (req, res) => {
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
});
  
//****************************************************************Skill*********************************************************************
//fetch all skills
app.get("/skill",async(req,res) => {
  try{
    const result = await pool.query (`select * from Skill`);

    if(result.rows.length === 0){
        return res.status(404).json({message: 'Skills not found'});
    }
    res.json(result.rows);
  } catch(error) {
    console.log(error);
    res.status(500).json({error: error.message});
}
});

//add new skill
app.post("/skill/add"  ,async(req,res) => {
  const {name,category_id} = req.body;

  try{
      const result = await pool.query(`insert into Skill (name,category_id) values ($1,$2) RETURNING *`,[name,category_id]);
      res.status(201).json(result.rows[0]);
  } catch(error) {
      console.log(error);
      res.status(500).json({error: error.message});
  }
});

//****************************************************************SkillCategory*********************************************************************
//fetch all category
app.get("/category",async(req,res) => {
  try{
    const result = await pool.query (`select * from SkillCategory`);

    if(result.rows.length === 0){
        return res.status(404).json({message: 'Category not found'});
    }
    res.json(result.rows);
  } catch(error) {
    console.log(error);
    res.status(500).json({error: error.message});
}
});

//add new category
app.post("/category/add"  ,async(req,res) => {
  const {name} = req.body;

  try{
      const result = await pool.query(`insert into SkillCategory (name) values ($1) RETURNING *`,[name]);
      res.status(201).json(result.rows[0]);
  } catch(error) {
      console.log(error);
      res.status(500).json({error: error.message});
  }
});

//****************************************************************Department*********************************************************************
//fetch all department
app.get("/dept",async(req,res) => {
  try{
    const result = await pool.query (`select * from Department`);

    if(result.rows.length === 0){
        return res.status(404).json({message: 'Department not found'});
    }
    res.json(result.rows);
  } catch(error) {
    console.log(error);
    res.status(500).json({error: error.message});
}
});

//add new skill
app.post("/dept/add"  ,async(req,res) => {
  const {name} = req.body;

  try{
      const result = await pool.query(`insert into Department (name) values ($1) RETURNING *`,[name]);
      res.status(201).json(result.rows[0]);
  } catch(error) {
      console.log(error);
      res.status(500).json({error: error.message});
  }
});

//********************************************EmployeeTrainings*****************************************************
app.put('/update-status', async (req, res) => {
  const { EmployeeId, TrainingId, completionstatus } = req.body;

  // // Ensure the status is either "Completed" or "In Progress"
  // if (!['Completed', 'In Progress'].includes(completionstatus)) {
  //   return res.status(400).json({ error: 'Invalid status' });
  // }

  try {
    const result = await pool.query(
      'UPDATE EmployeeTrainings SET completionstatus = $1 WHERE EmployeeId = $2 AND TrainingId = $3 RETURNING *',
      [completionstatus, EmployeeId, TrainingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Training record not found' });
    }

    return res.status(200).json({
      message: 'Training status updated successfully',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
  