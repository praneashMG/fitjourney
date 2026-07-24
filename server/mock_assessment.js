
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitness');
    const user = await User.findOne({ email: 'praneashp@gmail.com' });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }
    
    // Generate a token just like the frontend
    const jwt = await import('jsonwebtoken');
    const token = jwt.default.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '30d' });

    console.log('Sending mock assessment...');
    const response = await fetch('http://localhost:5000/api/assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        fullName: user.fullName,
        email: user.email,
        age: "25",
        gender: "Male",
        phone: "+1 234 567 8900",
        height: "175",
        currentWeight: "70",
        targetWeight: "65",
        activityLevel: "Moderately Active",
        goal: "Fat Loss",
        experienceLevel: "Intermediate",
        workoutLocation: "Gym",
        foodPreference: "Non Vegetarian",
        workoutDuration: "60 Minutes",
        dateOfBirth: "1995-01-01",
        preferredLanguage: "English",
        country: "USA",
        city: "New York"
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Success:', data);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
