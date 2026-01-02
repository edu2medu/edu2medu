require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./model/User');

async function testUpdateResponse() {
    console.log('--- Testing Update Response Structure ---');
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is undefined in .env');
        }
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('   ✅ Connected!');

        // 1. Create temporary user
        const testEmail = `update_crash_test_${Date.now()}@example.com`;
        // Using a valid category for education userType
        const user = await User.create({
            name: 'Crash Tester',
            email: testEmail,
            password: 'password123',
            phone: '1234567890',
            userType: 'education',
            category: 'Private Tutor',
            status: 'active'
        });
        console.log('   ✅ User created');

        // 2. Mock Update Logic
        const updateFields = {
            name: 'Updated Crash Tester',
            description: 'Updated Description'
        };

        const updatedUser = await User.findOneAndUpdate(
            { email: testEmail },
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password -tokens -verifytoken -verifytokenExpires');

        console.log('\n--- Response Object Analysis ---');
        console.log('Type of updatedUser:', typeof updatedUser);
        console.log('Is Mongoose Document?', updatedUser instanceof mongoose.Model);
        console.log('Constructor name:', updatedUser.constructor.name);

        // Simulate JSON serialization (what res.json does)
        const jsonOutput = JSON.parse(JSON.stringify(updatedUser));
        console.log('\nSerialized JSON Keys:', Object.keys(jsonOutput));

        // Check for potential issues
        if (jsonOutput.image === undefined) {
            console.warn('⚠️ Image field is undefined in JSON output');
        }

        // Cleanup
        await User.deleteOne({ email: testEmail });

    } catch (err) {
        console.error('❌ TEST FAILED:', err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

testUpdateResponse();
