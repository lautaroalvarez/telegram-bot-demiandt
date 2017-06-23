'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({
  type: {
    type: String,
    enum: ['text']
  },
  matching: {
    text: String,
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    }
  },
  response: {
    text: String,
    sticker: {
      file_id: String,
      width: Number,
      height: Number,
      thumb: {
        file_id: String,
        width: Number,
        height: Number,
        file_size: Number
      },
      emoji: String,
      file_size: Number
    },
    photo: [{
      file_id: String,
      width: Number,
      height: Number,
      file_size: Number
    }]
  }
}, {
    timestamps: true
});

module.exports = mongoose.model('Answer', answerSchema);
