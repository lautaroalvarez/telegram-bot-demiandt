const permissions = {
  'all': [231737762]
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

module.exports = {
  canCommand
}
