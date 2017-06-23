'use strict';

const TeleBot = require('telebot');
const providers = require('./providers');
const statusHandler = require('./services/statusHandler');
require('dotenv').load();

const mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB);

const bot = new TeleBot({
  token: process.env.BOT_ID
});

var messages = [];

bot.mod('message', (data, props) => {
  data.message.internalData = {};
  data.message.promiseAnalizer = providers.Message.save(data.message)
    .then(function(msg) {
      data.message.from = msg.from;
      data.message.chat = msg.chat;
      return data.message;
    });
  return data;
});

bot.on('/ayuda', msg => {
  msg.promiseAnalizer
    .then(function(msgModif) {
      msg = msgModif;
      if (msg.from.status != 'none')
        return providers.User.saveChange({
          query: {
            _id: msg.from._id,
          },
          changes: {
            status: 'none'
          }
        });
      return msg.from;
    })
    .then(function(user) {
      let replyMarkup = bot.keyboard([
        [bot.button('/nueva_palabra')],
        [bot.button('/mostrar_palabras')],
        [bot.button('/eliminar_palabra')]
      ], {resize: true});
      return bot.sendMessage(msg.chat.id, 'Ahí te tiré opciones loco', {replyMarkup});
    })
    .catch(function(err) {
      console.error(err);
    });
});

bot.on('/mostrar_palabras', msg => {
  msg.promiseAnalizer
    .then(function(msgModif) {
      msg = msgModif;
      return providers.Answer.getAnswers();
    })
    .then(function(answers) {
      var response = 'Palabras guardadas:\n';
      answers.map(function(elem) {
        response += elem._id + ':\n';
        response += ' -T: ' + elem.matching.text + '\n';
        response += ' -R: ' + elem.response.text + '\n';
      });
      return bot.sendMessage(msg.chat.id, response, {replyMarkup: 'hide'});
    })
    .catch(function(message) {
      console.log("Sale por catch de /mostrar_palabras");
      console.log(message);
    });
});

bot.on('/nueva_palabra', msg => {
  msg.promiseAnalizer
    .then(function(msgModif) {
      msg = msgModif;
      return providers.User.saveChange({
        query: {
          _id: msg.from._id,
        },
        changes: {
          status: 'np_waitingtext'
        }
      });
    })
    .then(function(user) {
      return bot.sendMessage(msg.chat.id, 'Pasame el texto lanzador de la respuesta:', {replyMarkup: 'hide'});
    });
});

bot.on('/eliminar_palabra', msg => {
  msg.promiseAnalizer
    .then(function(msgModif) {
      msg = msgModif;
      return providers.User.saveChange({
        query: {
          _id: msg.from._id,
        },
        changes: {
          status: 'ep_waitingtextorid'
        }
      });
    })
    .then(function(user) {
      return bot.sendMessage(msg.chat.id, 'Pasame el texto lanzador de la respuesta que querés eliminar (si te sabés el id también)', {replyMarkup: 'hide'});
    });
});

bot.on('*', (msg) => {
  msg.promiseAnalizer
    .then(function(msgModif) {
      msg = msgModif;
      if (typeof msg.entities !== 'undefined') {
        var esCmd = msg.entities.find(function(elem) {
          return elem.type = 'bot_command';
        });
        if (esCmd)
          return Promise.reject('Ya se analizó, es cmd.');
      }
      return msg;
    })
    .then(function(msg) {
      statusHandler[msg.from.status]({msg});
    })
    .catch(function(dataErr) {
      console.log("No Respondo:");
      console.log(dataErr);
    });
});

bot.start();
