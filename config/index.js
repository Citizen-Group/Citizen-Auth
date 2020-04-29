'use strict';

//
// The configuration options of the server
//

/**
 * Configuration of access tokens.
 *
 * expiresIn               - The time in minutes before the access token expires. Default is 60
 *                           minutes
 * calculateExpirationDate - A simple function to calculate the absolute time that the token is
 *                           going to expire in.
 */
exports.token = {
  expiresIn               : 60 * 60,
  calculateExpirationDate : () => new Date(Date.now() + (this.token.expiresIn * 1000)),
};

/**
 * Configuration of code token.
 * expiresIn - The time in minutes before the code token expires.  Default is 5 minutes.
 */
exports.codeToken = {
  expiresIn : 5 * 60,
};

/**
 * Configuration of refresh token.
 * expiresIn - The time in minutes before the code token expires.  Default is 100 years.  Most if
 *             all refresh tokens are expected to not expire.  However, I give it a very long shelf
 *             life instead.
 */
exports.refreshToken = {
  expiresIn : 52560000,
};

/**
 * Database configuration for access and refresh tokens.
 *
 * timeToCheckExpiredTokens - The time in seconds to check the database for expired access tokens.
 *                            For example, if it's set to 3600, then that's one hour to check for
 *                            expired access tokens.
 */
exports.db = {
  hostname                 : 'localhost',
  name                     : 'CITIZENAUTH',
  port                     : 27017,
  timeToCheckExpiredTokens : 3600,
};

/**
 * Session configuration
 *
 * maxAge - The maximum age in milliseconds of the session.  Use null for web browser session only.
 *          Use something else large like 3600000 * 24 * 7 * 52 for a year.
 * secret - The session secret that you should change to what you want
 */
exports.session = {
  maxAge : 3600000 * 24 * 7 * 52,
  secret : 'a351c011dee8bc34f01b022a31de2102',
};
