var pmx = require('pmx');

function initActions(couchdbClient) {

  // Show Config
  pmx.action('Show config', function (reply) {
    couchdbClient.config(function (err, results) {
      if (err) {
        return reply(err);
      }

      reply(results);
    })
  });

  // Show Active Tasks
  pmx.action('Show Active Tasks', function (reply) {
    couchdbClient.activeTasks(function (err, results) {
      if (err) {
        return reply(err);
      }

      reply(results);
    })
  });

  // List DBs
  pmx.action('List DBs', function (reply) {
    couchdbClient.databases(function (err, results) {
      if (err) {
        return reply(err);
      }

      reply(results);
    })
  });

}

function init(couchdbClient) {
  initActions(couchdbClient);
}

module.exports.init = init;