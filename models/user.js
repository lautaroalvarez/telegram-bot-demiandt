'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  id: Number,
  first_name: String,
  last_name: String,
  username: String,
  language_code: String
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
