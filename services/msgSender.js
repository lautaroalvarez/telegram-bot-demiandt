'use strict';

const providers = require('./../providers');
const Promise = require('promise');
var userParams = {};

const sendMessage = function(msg, reply) {
  providers.Logger.logAnswer(msg);
  if (msg.response.text)
    return sendTextMessage(msg, reply);
  if (msg.response.sticker && msg.response.sticker.file_id)
    return sendStickerMessage(msg, reply);
  if (msg.response.photo)
    return sendPhotoMessage(msg, reply);
  return Promise.reject('No se como enviar el mensaje');
}

const sendTextMessage = function(msg, reply) {
  reply.text(msg.response.text);
}

const sendStickerMessage = function(msg, reply) {
  reply.sticker(msg.response.sticker.file_id);
}

const sendPhotoMessage = function(msg, reply) {
  reply.photo(msg.response.photo[0].file_id);
}

module.exports = {
  sendMessage
};
