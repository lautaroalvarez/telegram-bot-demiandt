'use strict';

const TeleBot = require('telebot');
const providers = require('./providers');
require('dotenv').load();

const mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB);

const bot = new TeleBot(process.env.BOT_ID);

bot.on(/^\//, function(msg, props) {
  console.log('entra a comando');
  console.log(msg);
  var cmd = msg.text.substring(1);
  console.log(cmd.indexOf(' '));
  if (cmd.indexOf(' ') >= 0)
    cmd = cmd.substring(0, cmd.indexOf(' '));
  console.log("Comando: " + cmd);
  providers.Auth.canExec(cmd, msg)
    .then(function() {
      return providers.Command.exec(cmd, msg)
    })
    .then(function(dataResp) {
      console.log("Respondo:");
      console.log(dataResp);
      if (dataResp.message)
        return msg.reply.text(dataResp.message);
    })
    .catch(function(dataErr) {
      console.log("No Respondo:");
      console.log(dataErr);
      if (dataErr.message)
        return msg.reply.text(dataErr.message);
    });
});

bot.on('text', (msgOriginal) => {
  console.log('entra a text');
  console.log(msgOriginal);
  providers.Message.save(msgOriginal)
    .then(function(msg) {
      console.log('vuelve de save');
      console.log(msg);
      if (typeof msgOriginal.entities !== 'undefined') {
        var esCmd = msgOriginal.entities.find(function(elem) {
          return elem.type = 'bot_command';
        });
        if (esCmd)
          return Promise.reject('Ya se analizó, es cmd.');
      }
      return msg;
    })
    .then(function(msg) {
      console.log('no es cmd');
      return providers.Answer.searchAnswerFromMessage(msg);
    })
    .then(function(dataResp) {
      console.log("Respondo:");
      console.log(dataResp);
      msgOriginal.reply.text(dataResp.response.dataS1);
    })
    .catch(function(dataErr) {
      console.log("No Respondo:");
      console.log(dataErr);
    });
});

bot.start();
