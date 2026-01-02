require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./model/User');

async function testApiProjection() {
    console.log('--- Testing API Projection ---');
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is undefined in .env');
        }
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('   ✅ Connected!');

        // Simulating getAllUsers query with CORRECTED projection
        console.log('\n--- Simulating getAllUsers ---');
        const users = await User.find(
            { userType: "education", status: "active" },
            "name email phone category address description image contactInfo amenity establishment additionalInfo teachers status"
        ).lean().limit(1);

        if (users.length > 0) {
            const user = users[0];
            console.log('   Found user:', user.name);
            console.log('   Keys:', Object.keys(user));
            if (user.status) {
                console.log('   ✅ Status field exists:', user.status);
            } else {
                console.error('   ❌ FAILED: Status field is MISSING from projection!');
                process.exit(1);
            }
        } else {
            console.warn('   ⚠️ No active education users found to test.');
        }

    } catch (err) {
        console.error('❌ TEST FAILED:', err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

testApiProjection();
