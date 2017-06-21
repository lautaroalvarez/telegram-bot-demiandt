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
    dataS1: String
  }
}, {
    timestamps: true
});

module.exports = mongoose.model('Answer', answerSchema);
