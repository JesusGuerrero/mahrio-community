'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if ( process.env.NODE_ENV === 'development' ) {
  require('node-env-file')('.env');
  console.log('Running Development!');
}

const CONFIG = require('./config/env')( process.env )
  , SERVER = require('./config/hapi')( CONFIG )
  , IO = require('./config/sockets')( SERVER )
  , DB = require('./config/database')( CONFIG, SERVER );

require('./routes/index')( SERVER );

module.exports = SERVER;