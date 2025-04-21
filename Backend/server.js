const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth',authRoutes);
app.use('/employees', employeeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// pass this while request
// Authorization: Bearer <JWT_TOKEN>