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
const exec = function(command, msg) {
  var text = msg.text.substring(command.length + 2);
  switch (command) {
    case 'guardar_palabra':
      return guardarPalabra(text)
        .then(function(answer) {
          return {
            statusCode: 201,
            message: 'Guardé todo piola jefeh:\n -Texto: ' + answer.matching.text + '\n -Respuesta: ' + answer.response.dataS1
          }
        });
      break;
    case 'mostrar_palabras':
      return mostrarPalabras(text);
      break;
    case 'eliminar_palabra':
      return eliminarPalabra(text)
        .then(function(answer) {
          if (!answer)
            return {
              statusCode: 401,
              message: 'No encontré nada para borrar. Mandame algo bien escrito gil!'
            }
          return {
            statusCode: 200,
            message: 'Borré todo piola jefeh:\n -Texto: ' + answer.matching.text + '\n -Respuesta: ' + answer.response.dataS1
          }
        });
      break;
    default:
      return Promise.reject({
        statusCode: 400,
        message: 'No entendí nada!'
      });
  }
}

const guardarPalabra = function(text) {
  if (text.indexOf(delimit) < 0) {
    return Promise.resolve({
      statusCode: 400,
      message: 'No entiendo que me decís. Hablá bien gil!'
    });
  }
  var parts = text.split(delimit);
  return answerModel.create({
    type: 'text',
    matching: parts[0],
    response: parts[1]
  });
}

const eliminarPalabra = function(text) {
  // return answerModel.removeAnswer()
}

const mostrarPalabras = function(text) {
  return answerModel.getAnswers()
    .then(function(answers) {
      var response = 'Palabras guardadas:\n';
      answers.map(function(elem) {
        response += elem._id + ':\n';
        response += ' -T: ' + elem.matching.text + '\n';
        response += ' -R: ' + elem.response.dataS1 + '\n';
      });
      return {
        statusCode: 200,
        message: response
      }
    });
}

module.exports = {
  searchInText,
  exec
}
