import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String},
  role: { type: String, enum: ['consumer', 'vendor'], default: 'consumer' },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
