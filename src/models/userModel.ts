import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface User extends Document {
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this as User;
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as User;
  return bcrypt.compare(candidatePassword, user.password);
};

export default mongoose.model<User>('User', userSchema);