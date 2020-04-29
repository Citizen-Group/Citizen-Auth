'use strict';

const bodyParser     = require('body-parser');
const client         = require('./client');
const cookieParser   = require('cookie-parser');
const config         = require('./config');
const db             = require('./db');
const express        = require('express');
const expressSession = require('express-session');
const MongoStore     = require('connect-mongo')(expressSession);
const mongoose       = require('mongoose');
const fs             = require('fs');
const https          = require('https');
const oauth2         = require('./oauth2');
const passport       = require('passport');
const path           = require('path');
const site           = require('./site');
const token          = require('./token');
const user           = require('./user');
const usersDb   = require('./db/users');

console.log('Using MongoDB for the data store');

// TODO: This can be upgraded to take an user and pass and moving host for security in production
const mongoURI = `mongodb://${config.db.hostname}:${config.db.port}/${config.db.name}`;
const dbConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};
mongoose.connect(mongoURI, dbConnectionOptions);

console.log('Using MongoStore for the Session');

// Express configuration
const app = express();
app.set('view engine', 'ejs');
app.use(cookieParser());

// Session Configuration
// - https://github.com/expressjs/session
// - https://www.npmjs.com/package/connect-mongo
app.use(expressSession({
  saveUninitialized : true,
  resave            : true,
  secret            : config.session.secret,
  store             : new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: config.session.maxAge,
    autoRemove: 'native',
  }),
  key               : 'authorization.sid',
  cookie            : {
    maxAge: config.session.maxAge,
    secure: true,
  },
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./auth');

app.get('/',        site.index);
app.get('/login',   site.loginForm);
app.post('/login',  site.login);
app.get('/logout',  site.logout);
app.get('/account', site.account);

app.get('/dialog/authorize',           oauth2.authorization);
app.post('/dialog/authorize/decision', oauth2.decision);
app.post('/oauth/token',               oauth2.token);

app.get('/api/userinfo',   user.info);
app.get('/api/clientinfo', client.info);

app.post('/api/user', (req, res, next) => {
  usersDb.create(req.body).then(()=>next());
}, site.login);

// Mimicking google's token info endpoint from
// https://developers.google.com/accounts/docs/OAuth2UserAgent#validatetoken
app.get('/api/tokeninfo', token.info);

// Mimicking google's token revoke endpoint from
// https://developers.google.com/identity/protocols/OAuth2WebServer
app.get('/api/revoke', token.revoke);

// static resources for stylesheets, images, javascript files
app.use(express.static(path.join(__dirname, 'public')));

/**
 *  Catch all for error messages. Instead of a stack trace, this will log the json of
 *  the error message to the browser and pass along the status with it
 */
app.use((err, req, res, next) => {
  if (err) {
    if (err.status == null) {
      console.error('Internal unexpected error from:', err.stack);
      res.status(500);
      res.json(err);
    } else {
      res.status(err.status);
      res.json(err);
    }
  } else {
    next();
  }
});

// On Start add all the model files to be ready for use
fs.readdirSync(`${__dirname}/db/schemas`).forEach((filename) => {
  // eslint-disable-next-line no-bitwise
  if (~filename.indexOf('.js')) {
    // eslint-disable-next-line global-require
    require(`${__dirname}/db/schemas/${filename}`);
  }
});

// Hacky test code to seed the DB when empty
mongoose.model('Users').find({}).then((doc) => {
  if (doc.length === 0){
    mongoose.model('Users').create({
      id       : '1',
      username : 'bob',
      password : 'secret',
      name     : 'Bob Smith',
    });
  }
});

mongoose.model('Clients').find({}).then((doc) => {
  if (doc.length == 0){
    mongoose.model('Clients').insertMany([{
      id            : '1',
      name          : 'Samplr',
      clientId      : 'abc123',
      clientSecret  : 'ssh-secret',
    }, {
      id            : '2',
      name          : 'Samplr2',
      clientId      : 'xyz123',
      clientSecret  : 'ssh-password',
    }, {
      id            : '3',
      name          : 'Samplr3',
      clientId      : 'trustedClient',
      clientSecret  : 'ssh-otherpassword',
      trustedClient : true,
    }], (err) => {
    });
  }
});

// TODO: Change these for your own certificates.  This was generated through the commands:
// TODO: I run my products behind a proxy. This might be all removable?
// openssl genrsa -out privatekey.pem 2048
// openssl req -new -key privatekey.pem -out certrequest.csr
// openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
const options = {
  key  : fs.readFileSync(path.join(__dirname, 'certs/privatekey.pem')),
  cert : fs.readFileSync(path.join(__dirname, 'certs/certificate.pem')),
};

// Create our HTTPS server listening on port 3000.
https.createServer(options, app).listen(3000);
console.log('OAuth 2.0 Authorization Server started on port 3000');
