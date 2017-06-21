'use strict';

const models = require('../models');

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
    answers[dataAns.text].push(dataAns.response);
    resolve({
      statusCode: 201,
      message: "Guardé '" + dataAns.response + "' todo piola."
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
const dropAnswer = function(dataText) {
  return new Promise(function(resolve) {
    resolve();
  });
}
const getAnswers = function() {
  return models.Answer.find();
}

const searchAnswerFromMessage = function(msg) {
  return models.Answer.find()
    .then(function(dataAnswers) {
      return dataAnswers.find(function(elem) {
        return (new RegExp(elem.matching.text, 'i')).test(msg.text);
      });
    })
    .then(function(dataAnswers) {
      if (!dataAnswers)
        return Promise.reject('No hay respuesta');
      return dataAnswers;
    })
}

const create = function(dataAns) {
  // por ahora solo type=text
  var newAnswer = new models.Answer({
    type: dataAns.type,
    matching: {
      text: dataAns.matching
    },
    response: {
      dataS1: dataAns.response
    }
  });
  return newAnswer.save();
}

module.exports = {
  saveAnswer,
  getAnswer,
  dropAnswer,
  getAnswers,
  searchAnswerFromMessage,
  create
}
