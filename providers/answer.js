'use strict';

const mongoose = require('mongoose');
const models = require('../models');

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

const findByText = function(text) {
  if (mongoose.Types.ObjectId.isValid(text))
    return models.Answer.find({
      _id: text
    });
  console.log("no es id");
  return models.Answer.find({
    'matching.text': text
  });
}

const remove = function(text) {
  console.log("a ver si es id");
  console.log(text);
  return findByText(text)
    .then(function(dataAnswer) {
      console.log("trajo dataAnswer");
      console.log(dataAnswer);
      if (dataAnswer.length == 0)
        return false;
      var ids = dataAnswer.map(function(elem) {
        return elem._id
      });
      console.log("borro los ids");
      console.log(ids);
      return models.Answer.remove({
        _id: {
          $in: ids
        }
      });
    });
}

module.exports = {
  getAnswers,
  searchAnswerFromMessage,
  create,
  remove
}
