require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./model/User');

async function testHomeData() {
    console.log('--- Starting Home Page Data Verification ---');
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is undefined in .env');
        }
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('   ✅ Connected!');

        // List All Users Detailed
        console.log('\n--- Detailed User List ---');
        const allUsers = await User.find({}).select('name email userType category status');
        allUsers.forEach(u => {
            console.log(`[${u.userType}] ${u.name} (${u.email}) - Cat: ${u.category} - Status: ${u.status}`);
        });

    } catch (err) {
        console.error('❌ TEST FAILED:', err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

testHomeData();
