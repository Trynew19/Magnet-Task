const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  // Task banane wala user
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Task jise assign kiya gaya (Requirement 7)
assignedTo: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }]
}, { timestamps: true });
module.exports = mongoose.model('Task', taskSchema);