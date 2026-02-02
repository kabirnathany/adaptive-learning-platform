/**
 * One-time script to set a user as admin by email.
 * Usage: node src/scripts/make-admin.js your@email.com
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

const email = process.argv[2];
if (!email) {
  console.error('Usage: node src/scripts/make-admin.js <email>');
  process.exit(1);
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const result = await User.updateOne(
    { email: email.trim().toLowerCase() },
    { $set: { role: 'admin' } }
  );
  if (result.matchedCount === 0) {
    console.error('No user found with that email.');
    process.exit(1);
  }
  console.log('User is now an admin.');
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
