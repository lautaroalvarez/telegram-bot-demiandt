const commandList = ['guardar_palabra', 'mostrar_palabras', 'eliminar_palabra'];
const delimit = ' - ';
const answerModel = require('./answer');

const searchInText = function(text) {
  return new Promise(function(resolve, reject) {
    var cmd = commandList.find(function(cmd) {
      return text.indexOf('/' + cmd) == 0;
    });
    resolve(cmd);
  });
}
const exec = function(command, text) {
  text = text.substring(command.length + 2);
  console.log("saco comando");
  console.log(text);
  switch (command) {
    case 'guardar_palabra':
      return guardarPalabra(text);
      break;
    case 'mostrar_palabras':
      return mostrarPalabras(text);
      break;
    case 'eliminar_palabra':
      return answerModel.dropAnswer(text);
      break;
    default:
      return Promise.reject({
        statusCode: 400,
        message: 'No entendí nada!'
      });
  }
}

const guardarPalabra = function(text) {
  console.log("llego a guardarPalabra");
  console.log(text);
  if (text.indexOf(delimit) < 0) {
    console.log('no hay delimitador');
    return Promise.resolve({
      statusCode: 400,
      data: 'No entiendo que me decís. Hablá bien gil!'
    });
  }
  var parts = text.split(delimit);
  console.log("divido por delimitador");
  console.log(parts);
  return answerModel.saveAnswer({
    text: parts[0],
    response: parts[1]
  })
}
const mostrarPalabras = function(text) {
  return new Promise(function(resolve, reject) {
    answerModel.getAnswers()
      .then(function(dataAnswers) {
        var response = 'Palabras guardadas:\n';
        Object.keys(dataAnswers.data).map(function(key) {
          console.log("una key: " + key);
          console.log("hay:");
          console.log(dataAnswers.data[key]);
          response += key + ':\n';
          dataAnswers.data[key].map(function(elemR) {
            response += '  ' + elemR + '\n';
          });
        });
        resolve({
          statusCode: 200,
          data: response
        });
      })
      .catch(reject);
  });
}

module.exports = {
  searchInText,
  exec
}
