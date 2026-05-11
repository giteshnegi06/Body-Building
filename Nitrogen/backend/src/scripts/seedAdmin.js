/**
 * Admin Seed Script
 * Run this ONCE to create your first admin account in the database.
 * Usage: npm run seed:admin
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    const ADMIN_EMAIL = 'admin@nitrogen.com';
    const ADMIN_PASSWORD = 'Admin@12345';

    // Check if admin already exists
    const existing = await usersCollection.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('⚠️  Admin already exists!');
      console.log('   Email:', existing.email);
      console.log('   Role:', existing.role);
      await mongoose.disconnect();
      return;
    }

    // Hash password directly (bypassing mongoose hooks for seed script)
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await usersCollection.insertOne({
      name: 'Nitrogen Admin',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      active: true,
      wishlist: [],
      cart: [],
      addresses: [],
      orderHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('\n🎉 Admin account created successfully!');
    console.log('─────────────────────────────────');
    console.log('   📧 Email   :', ADMIN_EMAIL);
    console.log('   🔐 Password:', ADMIN_PASSWORD);
    console.log('   👑 Role    : admin');
    console.log('─────────────────────────────────');
    console.log('\n⚠️  Change your password after first login!\n');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();
