'use strict';

const models = require('../models');
const Promise = require('promise');

const saveChange = function(userData) {
  return models.User.findOneAndUpdate(userData.query, userData.changes);
}

module.exports = {
  saveChange
};
