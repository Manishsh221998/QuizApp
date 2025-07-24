const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
defaultAnswer: { type: String, required: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
},{versionKey:false,timestamps:true});

module.exports = mongoose.model('Question', QuestionSchema);