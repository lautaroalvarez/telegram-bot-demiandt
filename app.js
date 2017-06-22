'use strict';

const TeleBot = require('telebot');
const providers = require('./providers');
require('dotenv').load();

const mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_DB);

const bot = new TeleBot(process.env.BOT_ID);

bot.on(/^\//, function(msg, props) {
  var cmd = msg.text.substring(1);
  if (cmd.indexOf(' ') >= 0)
    cmd = cmd.substring(0, cmd.indexOf(' '));
  providers.Auth.canExec(cmd, msg)
    .then(function() {
      return providers.Command.exec(cmd, msg)
    })
    .catch(function(dataErr) {
      console.log("No Respondo:");
      console.log(dataErr);
      if (dataErr.message)
        return msg.reply.text(dataErr.message);
    });
});

bot.on('text', (msgOriginal) => {
  providers.Message.save(msgOriginal)
    .then(function(msg) {
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
      return providers.Answer.searchAnswerFromMessage(msg);
    })
    .then(function(dataResp) {
      msgOriginal.reply.text(dataResp.response.dataS1);
    })
    .catch(function(dataErr) {
      console.log("No Respondo:");
      console.log(dataErr);
    });
});

bot.start();
