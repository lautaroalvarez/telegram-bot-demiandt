'use strict';

const providers = require('./../providers');
const Promise = require('promise');
const msgSender = require('./msgSender');
var groupID = -222083072;
var userParams = {};

const none = function(data) {
  return providers.Answer.searchAnswerFromMessage(data.msg)
    .then(function(dataMsg) {
      return msgSender.sendMessage(dataMsg, data.msg.reply)
    });
}

//--NUEVA PALABRA
const np_waitingtext = function(data) {
  userParams[data.msg.from.id] = {
    param1: data.msg.text
  }
  return providers.User.saveChange({
    query: {_id: data.msg.from._id},
    changes: {status: 'np_waitingresponse'}
  })
    .then(function(userSaved) {
      return data.msg.reply.text('Ahora decime la respuesta');
    })
}
const np_waitingresponse = function(data) {
  if (!userParams[data.msg.from.id])
    return Promise.reject('No me esperaba esto');
  return providers.Answer.create({
    type: 'text',
    matching: userParams[data.msg.from.id].param1,
    response: {
      text: data.msg.text,
      sticker: data.msg.sticker,
      photo: data.msg.photo,
    }
  })
    .then(function(newAnswer) {
      return providers.User.saveChange({
        query: {_id: data.msg.from._id},
        changes: {status: 'none'}
      });
    })
    .then(function(userSaved) {
      return data.msg.reply.text('Guardé todo piola jefeh');
    });
}

//--ELIMINAR PALABRA
const ep_waitingtextorid = function(data) {
  var borrado = false;
  return providers.Answer.remove(data.msg.text)
    .then(function(dataBorrado) {
      borrado = dataBorrado;
      return providers.User.saveChange({
        query: {_id: data.msg.from._id},
        changes: {status: 'none'}
      });
    })
    .then(function(userSaved) {
      if (!borrado)
        return data.msg.reply.text('No encontré nada para borrar. Mandame algo bien escrito gil!');
      return data.msg.reply.text('Borré todo piola jefeh');
    });
}

//--MANDAR MENSAJE A GRUPO
const mg_waitingmsg = function(data) {
  var envio = true;
  return Promise.resolve()
    .then(function() {
      if (data.msg.text)
        return data.bot.sendMessage(groupID, data.msg.text);
      if (data.msg.sticker && data.msg.sticker.file_id)
        return data.bot.sendSticker(groupID, data.msg.sticker.file_id);
      if (data.msg.photo)
        return sendPhoto(groupID, data.msg.photo);
      envio = false;
    })
    .then(function(newAnswer) {
      return providers.User.saveChange({
        query: {_id: data.msg.from._id},
        changes: {status: 'none'}
      });
    })
    .then(function(userSaved) {
      if (!envio)
        return data.msg.reply.text('No se que me mandaste, pero no lo pude reenviar');
      return data.msg.reply.text('Alto mensaje mandamo eh');
    });
}

module.exports = {
  none,
  np_waitingtext,
  np_waitingresponse,
  ep_waitingtextorid,
  mg_waitingmsg
}
