const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
},{versionKey:false,timestamps:true});

module.exports = mongoose.model('Category', CategorySchema);