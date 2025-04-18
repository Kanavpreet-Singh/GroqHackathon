const mongoose = require('mongoose');
let User=require('./user')
const newsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inputType: {
    type: String,
    enum: ['text', 'video','audio'],
    required: true
  },
  videoUrl: {
    type: String,
    default: null
  },
  originalText: {
    type: String,
    default: null
  },
  summarizedText: {
    type: String,
    default: null
  },
  transcription: {
    type: String,
    required:true
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
