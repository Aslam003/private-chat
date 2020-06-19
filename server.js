const express = require('express');
const connectDB = require('./config/db');
// const cors = require('cors');
const app = express();
// app.use(cors());

//Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Database connect
connectDB();

const PORT = process.env.PORT || 5000;

// @Routes
app.use('/api/register', require('./routes/register'));
app.use('/api/auth', require('./routes/auth'));

app.listen('5000', () => {
  console.log(`Server started successfully on port ${PORT}`);
});
