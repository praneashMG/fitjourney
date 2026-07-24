import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });
    
    if (!adminExists) {
      const adminUser = new User({
        fullName: 'System Admin',
        email: adminEmail,
        password: 'admin1234**',
        phone: '0000000000',
        role: 'Admin',
        isVerified: true,
        isActive: true
      });
      await adminUser.save();
      console.log('✅ Default Admin account seeded successfully!');
    } else {
      // Force role to Admin in case they registered it as a normal user previously
      if (adminExists.role !== 'Admin') {
        adminExists.role = 'Admin';
        await adminExists.save();
        console.log('✅ Forced existing user role to Admin!');
      }
    }
  } catch (error) {
    console.error('❌ Error seeding admin account:', error.message);
  }
};

export default seedAdmin;
