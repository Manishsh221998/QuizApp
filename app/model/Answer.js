const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  selectedOption: String,
  submittedAt: Date
},{versionKey:false,timestamps:true});

module.exports = mongoose.model('Answer', AnswerSchema);