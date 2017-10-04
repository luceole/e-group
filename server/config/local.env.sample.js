'use strict';

// Use local.env.js for environment variables that will be set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:9000',
  SESSION_SECRET: 'ecommunaut-secret',
  /*
   etherpad: {
   apikey: 'ab5bf2',
   host: 'localhost',
   port: '9001'
   },
   */

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
