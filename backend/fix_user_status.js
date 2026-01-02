require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./model/User');

async function unblockUsers() {
    console.log('--- Unblocking Users ---');
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is undefined in .env');
        }
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('   ✅ Connected!');

        // Update all 'blocked' users to 'active'
        const result = await User.updateMany(
            { status: 'blocked' },
            { $set: { status: 'active' } }
        );

        console.log(`   ✅ Updated ${result.modifiedCount} users from 'blocked' to 'active'.`);

        // Verify
        const remainingBlocked = await User.countDocuments({ status: 'blocked' });
        console.log(`   Remaining blocked users: ${remainingBlocked}`);

    } catch (err) {
        console.error('❌ UPDATE FAILED:', err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

unblockUsers();
