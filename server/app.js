/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';


// Etherpad ?
if (config.etherpad) {
  var ether_api = require('etherpad-lite-client');
  console.log(" - Link Etherpad=" + config.etherpad.host + ":" + config.etherpad.port);
  global.etherpad = ether_api.connect({
    apikey: config.etherpad.apikey,
    host: config.etherpad.host,
    port: config.etherpad.port,
  });
}

// Connect to ldap ?
if (config.ldap) {
  console.log(" - Link Ldap=" + config.ldap.host);
  var ldap = require('ldapjs');
  var clientLdap = ldap.createClient({
    url: 'ldap://' + config.ldap.host
  });
  clientLdap.bind(config.ldap.baseDN, config.ladp.password, function (err) {
    console.log(err)
  });
}
// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function (err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1); // eslint-disable-line no-process-exit
});

// Populate databases with sample data
if (config.seedDB) {
  require('./config/seed');
}

// Setup server
var app = express();
var server = http.createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio').default(socketio);
require('./config/express').default(app);
require('./routes').default(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
