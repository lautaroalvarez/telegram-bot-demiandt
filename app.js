const TeleBot = require('telebot');
const models = require('./models');

const bot = new TeleBot('420103356:AAHcOPrbMbpbwdGrYAdJ_hejYzJeciC3obg');

bot.on(/^\//, function(msg, props) {
  console.log('entra a comando');
  console.log(msg);
  var cmd = msg.text.substring(1);
  console.log(cmd.indexOf(' '));
  if (cmd.indexOf(' ') >= 0)
    cmd = cmd.substring(0, cmd.indexOf(' '));
  console.log("Comando: " + cmd);
  models.Auth.canExec(cmd, msg)
    .then(function() {
      return models.Command.exec(cmd, msg)
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

bot.on('text', (msg) => {
  if (typeof msg.entities !== 'undefined') {
    var escmd = msg.entities.find(function(elem) {
      return elem.type = 'bot_command';
    });
    if (escmd)
      return;
  }
  console.log(msg);
  models.Answer.getAnswer({ text: msg.text })
    .then(function(dataResp) {
      console.log("Respondo:");
      console.log(dataResp);
      if (dataResp.data)
        msg.reply.text(dataResp.data);
    })
    .catch(function(dataErr) {
      console.log("No Respondo:");
      console.log(dataErr);
    });
});

bot.start();

// app.post('/new-message', function(req, res) {
//   const {message} = req.body;
//   if (!message)
//     return;
//   console.log("Recibo texto: " + message.text);
//   models.Command.searchInText(message.text)
//     .then(function(command) {
//       console.log("command");
//       console.log(command);
//       if (command)
//         return models.Command.exec(command, message.text);
//       return models.Answer.getAnswer({ text: message.text });
//     })
//     .then(function(dataResp) {
//       console.log("Respondo:");
//       console.log(dataResp);
//       enviarMensaje({
//         chat_id: message.chat.id,
//         text: dataResp.data
//       });
//       res.end();
//     })
//     .catch(function(dataErr) {
//       console.log("No Respondo:");
//       console.log(dataErr);
//       res.end();
//     });
// });
//
// function enviarMensaje(data) {
//   axios.post('https://api.telegram.org/bot420103356:AAHcOPrbMbpbwdGrYAdJ_hejYzJeciC3obg/sendMessage', data);
// }
// // Finally, start our server
// app.listen(3000, function() {
//   console.log('Telegram app listening on port 3000!');
// });
