const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./model/User'); // ← Make sure path is correct (models/User)
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding...');

    // Create Admin
    let admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      admin = await User.create({
        email: 'admin@example.com',
        password: await bcrypt.hash('adminpassword', 10),
        role: 'admin'
      });
      console.log('✅ Admin created: admin@example.com / adminpassword');
    } else {
      console.log('✅ Admin already exists');
    }

    // Create Employee 1
    let emp1 = await User.findOne({ email: 'employee1@example.com' });
    if (!emp1) {
      emp1 = await User.create({
        email: 'employee1@example.com',  // ← Fixed: removed leading dot
        password: await bcrypt.hash('employee123', 10),
        role: 'employee'
      });
      console.log('✅ Employee created: employee1@example.com / employee123');
    } else {
      console.log('✅ Employee1 already exists');
    }

    // Create Employee 2
    let emp2 = await User.findOne({ email: 'employee2@example.com' });
    if (!emp2) {
      emp2 = await User.create({
        email: 'employee2@example.com',
        password: await bcrypt.hash('employee2123', 10),
        role: 'employee'
      });
      console.log('✅ Employee created: employee2@example.com / employee2123');
    } else {
      console.log('✅ Employee2 already exists');
    }

    console.log('\n🎉 Seeding completed successfully!');
    console.log('   Login as Admin:     admin@example.com       / adminpassword');
    console.log('   Login as Employee:  employee1@example.com   / employee123');
    console.log('   Login as Employee:  employee2@example.com   / employee2123\n');

    process.exit();
  })
  .catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });