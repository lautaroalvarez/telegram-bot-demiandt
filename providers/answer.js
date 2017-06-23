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
    response: dataAns.response
  });
  return newAnswer.save();
}

const findByText = function(text) {
  if (mongoose.Types.ObjectId.isValid(text))
    return models.Answer.find({
      _id: text
    });
  return models.Answer.find({
    'matching.text': text
  });
}

const remove = function(text) {
  return findByText(text)
    .then(function(dataAnswer) {
      if (dataAnswer.length == 0)
        return false;
      var ids = dataAnswer.map(function(elem) {
        return elem._id
      });
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
