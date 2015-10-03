var pmx = require('pmx');
var _ = require('lodash');

var metrics = {};
var REFRESH_RATE = 5000; // ms
var probe = pmx.probe();

// Init metrics with default values
function initMetrics() {
  metrics.version = probe.metric({
    name: 'CouchDB Version',
    value: 'N/A'
  });
  metrics.openDatabases = probe.metric({
    name: 'Open Databases',
    value: 'N/A'
  });
  metrics.databaseReads = probe.metric({
    name: 'DB Reads',
    value: 'N/A'
  });
  metrics.databaseWrites = probe.metric({
    name: 'DB Writes',
    value: 'N/A'
  });
  metrics.meanRequestTime = probe.metric({
    name: 'Mean Req. Time',
    value: 'N/A',
    alert: {
      mode: 'threshold-avg',
      value: 2000,
      msg: 'Mean Request Time too high',
      cmp: ">"
    }
  });
  metrics.maxRequestTime = probe.metric({
    name: 'Max Req. Time',
    value: 'N/A'
  });
  metrics.currHttpRequests = probe.metric({
    name: 'HTTP Requests',
    value: 'N/A'
  });
  metrics.currOpenFiles = probe.metric({
    name: 'Open Files',
    value: 'N/A'
  });
  metrics.currAuthCacheHits = probe.metric({
    name: 'Auth Cache Hits',
    value: 'N/A'
  });
  metrics.currBulkRequests = probe.metric({
    name: 'Bulk Requests',
    value: 'N/A'
  });
}

// Refresh Version
function refreshVersion(couchdbClient) {
  couchdbClient.info(function (err, info) {
    if(err){
      return pmx.notify("Couldn't fetch version");
    }

    metrics.version.set(info.version);
  });
}

// Refresh metrics
function refreshMetrics(couchdbClient) {
  couchdbClient.stats(function (err, stats) {
    if (err) {
      if (err.reason) {
        return pmx.notify("Couldn't connect to couchdb: " + err.reason);
      }
      else if (err.code === 'ECONNREFUSED') {
        return pmx.notify("Couldn't access couchdb server, make sure the server is running");
      }
      else {
        return pmx.notify("Couldn't connect to couchdb: " + err);
      }
    }

    // # of Currently Open Databases
    var openDatabases = getStatVal(stats, 'couchdb.open_databases.current');
    metrics.openDatabases.set(openDatabases);

    // # of Database Reads
    var databaseReads = getStatVal(stats, 'couchdb.database_reads.current');
    metrics.databaseReads.set(databaseReads);

    // # of Database Writes
    var databaseWrites = getStatVal(stats, 'couchdb.database_writes.current');
    metrics.databaseWrites.set(databaseWrites);

    // Mean Request Time
    var meanRequestTime = getStatVal(stats, 'couchdb.request_time.mean') ;
    if(_.isNumber(meanRequestTime)){
      meanRequestTime = meanRequestTime.toFixed(1);
    }
    metrics.meanRequestTime.set(meanRequestTime + " ms");

    // Max Request Time
    var maxRequestTime = getStatVal(stats, 'couchdb.request_time.max') ;
    if(_.isNumber(maxRequestTime)){
      maxRequestTime = maxRequestTime.toFixed(1);
    }
    metrics.maxRequestTime.set(maxRequestTime + " ms");

    // # of HTTP Requests
    var currHttpRequests = getStatVal(stats, 'httpd.requests.current');
    metrics.currHttpRequests.set(currHttpRequests);

    // # of Open Files
    var currOpenFiles = getStatVal(stats, 'couchdb.open_os_files.current');
    metrics.currOpenFiles.set(currOpenFiles);

    // # of Auth Cache Hits
    var currAuthCacheHits = getStatVal(stats, 'couchdb.auth_cache_hits.current');
    metrics.currAuthCacheHits.set(currAuthCacheHits);

    // # of Bulk Requests
    var currBulkRequests = getStatVal(stats, 'httpd.bulk_requests.current');
    metrics.currBulkRequests.set(currBulkRequests);
  });
}

function getStatVal(stats, path) {
  var val = _.get(stats, path, 'N/A');
  if (val === null) {
    val = 0;
  }
  return val;
}

function init(couchdbClient) {
  initMetrics();
  setInterval(refreshMetrics.bind(this, couchdbClient), REFRESH_RATE);
  refreshVersion(couchdbClient);
}

module.exports.init = init;
