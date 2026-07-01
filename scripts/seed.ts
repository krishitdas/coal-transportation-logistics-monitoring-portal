import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env');
  process.exit(1);
}

// In a real project, we would import from models directly. 
// For this standalone script to run without complex TS configuration, we define a basic schema inline.
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
  active: { type: Boolean, default: true },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clean existing
    await User.deleteMany({});
    console.log('Cleared Users');

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('admin123', salt);

    await User.create([
      {
        name: 'System Admin',
        email: 'admin@cil.in',
        passwordHash,
        role: 'Admin',
      },
      {
        name: 'Dispatch Manager',
        email: 'dispatch@cil.in',
        passwordHash,
        role: 'DispatchOfficer',
      }
    ]);

    console.log('Seeded Users successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
