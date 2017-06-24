const permissions = {
  'all': [231737762, 240669092]
}

const canCommand = function(data) {
  return new Promise(function(resolve, reject) {
    if (permissions.all.indexOf(data.msg.from.id) >= 0) {
      resolve();
      return;
    }
    reject({
      statusCode: 401,
      message: 'No puede ejecutar'
    });
  });
}

const isPrivateChat = function(data) {
  return new Promise(function(resolve, reject) {
    if (data.msg.from.id == data.msg.chat.id) {
      resolve();
      return;
    }
    reject({
      statusCode: 401,
      message: 'No es privado'
    });
  });
}

module.exports = {
  canCommand,
  isPrivateChat
}
