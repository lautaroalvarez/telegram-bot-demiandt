var answers = {
  'hola': ['Hola wachin!'],
  'chau': ['Nos vimo', 'Otro nos vimo'],
  'dos palabras': ['aa hablas mucho eh']
};

const saveAnswer = function(dataAns) {
  return new Promise(function(resolve, reject) {
    if (typeof dataAns.text == 'undefined' || typeof dataAns.response == 'undefined') {
      reject({
        statusCode: 400,
        message: "Falta data"
      });
      return;
    }
    dataAns.text = dataAns.text.toLowerCase();
    if (typeof answers[dataAns.text] === 'undefined')
      answers[dataAns.text] = [];
    answers.push(dataAns.response);
    resolve({
      statusCode: 201,
      data: "Guardé '" + dataAns.response + "' todo piola."
    });
  });
}
const getAnswer = function(dataText) {
  return new Promise(function(resolve, reject) {
    dataText.text = dataText.text.toLowerCase();
    if (typeof answers[dataText.text] == 'undefined' || answers[dataText.text].length == 0) {
      reject({
        statusCode: 404,
        message: "No hay respuesta"
      });
      return;
    }
    var answer = answers[dataText.text][Math.floor(Math.random() * answers[dataText.text].length)]
    resolve({
      statusCode: 200,
      data: answer
    });
  });
}
const removeAnswers = function(dataText) {
  return new Promise(function(resolve) {
    resolve();
  });
}
const getAnswers = function(dataText) {
  return new Promise(function(resolve) {
    resolve({
      statusCode: 200,
      data: answers
    })
  });
}

module.exports = {
  saveAnswer,
  getAnswer,
  removeAnswers,
  getAnswers
}
