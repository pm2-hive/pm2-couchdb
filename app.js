var pmx = require('pmx');
var couchdbClientFactory = require('./lib/clientFactory.js');
var couchdbStats = require('./lib/stats.js');
var couchdbActions = require('./lib/actions.js');

pmx.initModule({

  // No PID file for couchdb
  //pid: pmx.resolvePidPaths([]),

  // Options related to the display style on Keymetrics
  widget: {


    // Logo displayed
    logo: 'https://svn.apache.org/repos/asf/couchdb/supplement/logo/couchdb-site-brown.png',

    // Module colors
    // 0 = main element
    // 1 = secondary
    // 2 = main border
    // 3 = secondary border
    theme: ['#141A1F', '#222222', '#FC6400', '#807C7C'],

    // Section to show / hide
    el: {
      probes: true,
      actions: true
    },

    // Main block to show / hide
    block: {
      actions: true,
      issues: true,
      meta: true,

      // Custom metrics to put in BIG
      main_probes: ['Open Databases', 'DB Reads', 'DB Writes','Mean Request Time','HTTP Requests']
    }

  }

}, function (err, conf) {
  var couchdbClient = couchdbClientFactory.build(conf);

  // Init metrics refresh loop
  couchdbStats.init(couchdbClient);

  // Init actions
  couchdbActions.init(couchdbClient);
});
