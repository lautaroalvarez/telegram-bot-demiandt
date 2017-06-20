'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  message_id: Number,
  from: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  date: Number,
  chat: {
    type: Schema.ObjectId,
    ref: 'Chat'
  },
  forward_from: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  forward_from_chat: {
    type: Schema.ObjectId,
    ref: 'Chat'
  },
  forward_from_message_id: Number,
  forward_date: Number,
  reply_to_message: {
    type: Schema.ObjectId,
    ref: 'Message'
  },
  edit_date: Number,
  text: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
