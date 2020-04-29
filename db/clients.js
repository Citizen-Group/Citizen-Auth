'use strict';

const mongoose = require('mongoose');

/**
 * Returns a client if it finds one, otherwise returns null if a client is not found.
 * @param   {Number}   impId   - The unique id of the client to find
 * @returns {Promise}  resolved promise with the client if found, otherwise undefined
 */
exports.find = impId => mongoose.model('Clients').findOne({ id : impId });

/**
 * Returns a client if it finds one, otherwise returns null if a client is not found.
 * @param   {String}   impClientId - The unique client id of the client to find
 * @returns {Promise} resolved promise with the client if found, otherwise undefined
 */
exports.findByClientId = impClientId => mongoose.model('Clients').findOne({ clientId : impClientId });
