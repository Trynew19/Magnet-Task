const express = require('express');
const globalErrorHandler = require('./middleware/errorController');

const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use((req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err); 
});
app.use(globalErrorHandler);

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(3000, () => console.log('Server running on 3000'));
});