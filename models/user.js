'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  id: Number,
  first_name: String,
  last_name: String,
  username: String,
  language_code: String,
  status: {
    type: String,
    enum: ['none', 'np_waitingtext', 'np_waitingreponse', 'ep_waitingtextorid'],
    default: 'none'
  }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
