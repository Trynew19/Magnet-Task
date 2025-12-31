const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }
});

// FIX: Async use kar rahe ho toh 'next' ki zaroorat nahi hai
userSchema.pre('save', async function() {
  // Agar password modify nahi hua toh yahin se return ho jao
  if (!this.isModified('password')) return;

  // Password hash karo
  this.password = await bcrypt.hash(this.password, 12);
});

// Login ke liye password check karne ka method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);