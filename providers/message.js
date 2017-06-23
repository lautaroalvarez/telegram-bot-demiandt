'use strict';

const models = require('../models');
const Promise = require('promise');

const save = function(msg) {
  return saveUserInMsg(msg)
    .then(function(msg) {
      return saveChatInMsg(msg);
    })
    .then(function(msg) {
      var newMsg = models.Message(msg);
      return newMsg.save();
    })
    .then(function(newMsg) {
      return models.Message.findById(newMsg._id).populate('from chat');
    });
}

const saveUserInMsg = function(msg) {
  //--chequear si no viene from
  return models.User.find({
    id: msg.from.id
  })
    .then(function(userData) {
      if (userData.length > 0)
        return userData[0];
      var newUser = models.User(msg.from);
      return newUser.save();
    })
    .then(function(userData) {
      msg.from = userData._id;
      return msg;
    });
}

const saveChatInMsg = function(msg) {
  return models.Chat.find({
    id: msg.chat.id
  })
    .then(function(chatData) {
      if (chatData.length > 0)
        return chatData[0];
      var newChat = models.Chat(msg.chat);
      return newChat.save()
    })
    .then(function(chatData) {
      msg.chat = chatData._id;
      return msg;
    });
}

module.exports = {
  save
}
