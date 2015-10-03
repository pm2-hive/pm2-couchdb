# pm2-couchdb
CouchDB module for Keymetrics

![pm2-couchdb screenshot](https://raw.githubusercontent.com/pm2-hive/pm2-couchdb/master/pm2-couchdb.jpg)

## Description

PM2 module to monitor key CouchDB server metrics:

* DB Reads/Writes
* Open Databases / Open Files
* Max/Mean Request time
* HTTP Requests / Bulk Requests / Auth Cache hits

## Requirements

This module requires a CouchDB install (tested against v1.6.1).

## Install

```bash
$ npm install pm2 -g

$ pm2 install pm2-couchdb
```

## Config

The default connection details are :
"protocol": "http"
"hostname": "localhost"
"port": 5984
"username": "" // The module only uses authentication if username is not blank
"password": ""


To modify the config values you can use the commands:
```bash
$ pm2 set pm2-couchdb:protocol https
$ pm2 set pm2-couchdb:hostname myhost
$ pm2 set pm2-couchdb:port 8951
$ pm2 set pm2-couchdb:username mike
$ pm2 set pm2-couchdb:password XSDA5234
```

## Uninstall

```bash
$ pm2 uninstall pm2-couchdb
```

# License

MIT
