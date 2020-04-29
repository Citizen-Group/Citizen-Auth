'use strict';

const mongoose = require('mongoose');

/**
 * Returns a user if it finds one, otherwise returns null if a user is not found.
 * @param   {String}   impId - The unique id of the user to find
 * @returns {Promise} resolved user if found, otherwise resolves undefined
 */
exports.find = impId => mongoose.model('Users').findOne({ id : impId });

/**
 * Returns a user if it finds one, otherwise returns null if a user is not found.
 * @param   {String}   impUsername - The unique user name to find
 * @returns {Promise} resolved user if found, otherwise resolves undefined
 */
exports.findByUsername = impUsername => mongoose.model('Users').findOne({ username : impUsername });
