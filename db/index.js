'use strict';

// This file provides a single point to draw in the database

exports.accessTokens       = require('./accesstokens');
exports.authorizationCodes = require('./authorizationcodes');
exports.clients            = require('./clients');
exports.refreshTokens      = require('./refreshtokens');
exports.users              = require('./users');
exports.roles              = require('./roles');
