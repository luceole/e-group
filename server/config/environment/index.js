'use strict';
/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';

/*function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}*/
process.env.OPENID_ISSUER = process.env.OPENID_ISSUER || 'http://localhost:3333/oidc';
//
// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Browser-sync port
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3030,

  // Server port
  port: process.env.PORT || 9080,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'E-secret'
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  openid: {
    issuer: {
      issuer: process.env.OPENID_ISSUER,
      authorization_endpoint: `${process.env.OPENID_ISSUER}/auth`,
      token_endpoint: `${process.env.OPENID_ISSUER}/token`,
      userinfo_endpoint: `${process.env.OPENID_ISSUER}/me`,
      jwks_uri: `${process.env.OPENID_ISSUER}/certs`,
      end_session_endpoint: `${process.env.OPENID_ISSUER}/session/end`
    },
    client: {
      client_id: process.env.OPENDID_CLIENT_ID || 'e-group',
      client_secret: process.env.OPENDID_CLIENT_SECRET || 'NotSoSecret',
      redirect_uris: [`${process.env.DOMAIN || ''}/auth/openid/callback`]
    }
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require('../local.env.js'),
  require(`./${process.env.NODE_ENV}.js`) || {});
