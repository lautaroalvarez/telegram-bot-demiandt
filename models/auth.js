const permissions = {
  'all': ['laucha_sl']
}
const msg_no_permission = 'A vos no te respondo nada gil!';

const canExec = function(cmd, msg) {
  return new Promise(function(resolve, reject) {
    if (permissions.all.indexOf(msg.from.username) >= 0) {
      resolve();
      return;
    }
    if (typeof permissions[cmd] !== 'undefined' && permissions[cmd].indexOf(msg.from.username) >= 0) {
      resolve();
      return;
    }
    reject({
      statusCode: 401,
      message: msg_no_permission
    });
  });
}

module.exports = {
  canExec
}
