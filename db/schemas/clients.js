"use strict";

const mongoose = require("mongoose");

/**
 * This is the configuration of the clients that are allowed to connected to your authorization
 * server. These represent client applications that can connect. At a minimum you need the required
 * properties of
 *
 * id:           A unique numeric id of your client application
 * name:         The name of your client application
 * clientId:     A unique id of your client application
 * clientSecret: A unique password(ish) secret that is _best not_ shared with anyone but your
 *               client application and the authorization server.
 *
 * Optionally you can set these properties which are
 *
 * trustedClient: default if missing is false. If this is set to true then the client is regarded
 * as a trusted client and not a 3rd party application. That means that the user will not be
 * presented with a decision dialog with the trusted application and that the trusted application
 * gets full scope access without the user having to make a decision to allow or disallow the scope
 * access.
 */

const clientSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String },
  clientId: { type: String },
  clientSecret: { type: String },
  trustedClient: { type: Boolean },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    default: "basic",
    enum: ["basic", "mod", "admin"],
  },
  permissions: [String],
  accessToken: { type: String },
});

module.exports = mongoose.model("Clients", clientSchema);
