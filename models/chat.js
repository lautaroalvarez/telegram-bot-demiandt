'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatSchema = new Schema({
  id: Number,
  type: String,
  title: String,
  username: String,
  firstname: String,
  lastname: String,
  all_members_are_administrators: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema);
