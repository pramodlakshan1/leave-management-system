const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./model/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    await User.create({ email: 'admin@example.com', password: hashedPassword, role: 'admin' });
    console.log('Admin created');
    process.exit();
  })
  .catch(err => console.log(err));