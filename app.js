const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const wordModel = require('./models/words');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/new-message', function(req, res) {
  const {message} = req.body;
  if (!message)
    return;
  console.log("Recibo texto: " + message.text);
  wordModel.getAnswer({ text: message.text })
    .then(function(dataResp) {
      console.log("Respondo:");
      console.log(dataResp);
      axios.post('https://api.telegram.org/bot420103356:AAHcOPrbMbpbwdGrYAdJ_hejYzJeciC3obg/sendMessage', {
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

// Finally, start our server
app.listen(3000, function() {
  console.log('Telegram app listening on port 3000!');
});
