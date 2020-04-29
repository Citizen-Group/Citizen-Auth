'use strict';

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

/**
 * This is the schema of the users that are allowed to connected to your authorization
 * server.
 *
 * id       : A unique numeric id of your user
 * username : The user name of the user
 * password : The password of your user
 * name     : The name of your user
 */

const userSchema = new  mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, lowercase: true, trim: true, unique: true },
  created: { type: Date, default: Date.now },
});

// Virtual
// eslint-disable-next-line func-names
userSchema.virtual('name').get(function () {
  return `${this.first_name} ${this.last_name}`;
});

// Creates auto incrementing id
userSchema.plugin(AutoIncrement, { inc_field: 'id' });

module.exports = mongoose.model('Users', userSchema);
