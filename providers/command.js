const commandList = ['guardar_palabra', 'mostrar_palabras', 'eliminar_palabra'];
const delimit = ' - ';
const answerModel = require('./answer');
const models = require('../models');

const searchInText = function(text) {
  return new Promise(function(resolve, reject) {
    var cmd = commandList.find(function(cmd) {
      return text.indexOf('/' + cmd) == 0;
    });
    resolve(cmd);
  });
}
const exec = function(data) {
  var text = data.message.text.substring(data.command.length + 2);
  switch (data.command) {
    case 'guardar_palabra':
      return guardarPalabra(text, data.message);
      break;
    case 'eliminar_palabra':
      return eliminarPalabra(text, data.message);
      break;
    default:
      return Promise.reject({
        statusCode: 400,
        message: 'No entendí nada!'
      });
  }
}

const guardarPalabra = function(text, msg) {
  if (text.indexOf(delimit) < 0)
    return msg.reply.text('No entiendo que me decís. Hablá bien gil!');
  var parts = text.split(delimit);
  return answerModel.create({
    type: 'text',
    matching: parts[0],
    response: parts[1]
  })
    .then(function(answer) {
      return msg.reply.text('Guardé todo piola jefeh:\n -Texto: ' + answer.matching.text + '\n -Respuesta: ' + answer.response.dataS1);
    });
}

const eliminarPalabra = function(text, msg) {
  return answerModel.remove(text)
    .then(function(borrado) {
      if (!borrado)
        return msg.reply.text('No encontré nada para borrar. Mandame algo bien escrito gil!');
      return msg.reply.text('Borré todo piola jefeh');
    });
}


module.exports = {
  searchInText,
  exec
}
