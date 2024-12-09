const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middlewares/errorHandler');
const morgan = require('morgan');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api', taskRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; 
