var cradle = require('cradle');

function build(conf) {
  var opts = {};

  if (conf.username) {
    opts.auth = {username: conf.username, password: conf.password};
  }

  return new (cradle.Connection)(conf.protocol + "://" + conf.hostname, conf.port, opts);
}

module.exports.build = build;