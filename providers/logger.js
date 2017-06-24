
const logMessage = function(msg) {
  var userName = '';
  if (msg.from.username && msg.from.username != '')
    userName = msg.from.username;
  else
    userName = msg.from.first_name + ' ' + msg.from.last_name;
  var msgShow = '';
  if (msg.text)
    msgShow = msg.text;
  if (msg.sticker && msg.sticker.file_id)
    msgShow = 'Sticker';
  if (msg.photo && msg.photo.length > 0)
    msgShow = 'Foto';
  console.log('-> ' + userName + ': ' + msgShow);
  return;
}

const logAnswer = function(answer) {
  var msgShow = '';
  if (answer.response.text)
    msgShow = answer.response.text;
  if (answer.response.sticker && answer.response.sticker.file_id)
    msgShow = 'Sticker';
  if (answer.response.photo && answer.response.photo.length > 0)
    msgShow = 'Foto';
  console.log('-> Mando respuesta: ' + msgShow);
  return;
}

module.exports = {
  logMessage,
  logAnswer
}
