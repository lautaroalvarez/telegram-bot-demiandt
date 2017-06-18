const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const models = require('./models');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/new-message', function(req, res) {
  const {message} = req.body;
  if (!message)
    return;
  console.log("Recibo texto: " + message.text);
  models.Command.searchInText(message.text)
    .then(function(command) {
      console.log("command");
      console.log(command);
      if (command)
        return models.Command.exec(command, message.text);
      return models.Answer.getAnswer({ text: message.text });
    })
    .then(function(dataResp) {
      console.log("Respondo:");
      console.log(dataResp);
      enviarMensaje({
        chat_id: message.chat.id,
        text: dataResp.data
      });
      res.end();
    })
    .catch(function(dataErr) {
      console.log("No Respondo:");
      console.log(dataErr);
      res.end();
    });
});

function enviarMensaje(data) {
  axios.post('https://api.telegram.org/bot420103356:AAHcOPrbMbpbwdGrYAdJ_hejYzJeciC3obg/sendMessage', data);
}
// Finally, start our server
app.listen(3000, function() {
  console.log('Telegram app listening on port 3000!');
});
