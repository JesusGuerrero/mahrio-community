'use strict';

var Path = require('path'),
  rootPath = Path.normalize(__dirname + '/../');

module.exports = function( env ) {
  // Define default parameters and allow extending
  var environment =  {
    port: 8080,
    url: 'localhost',
    mongo: 'http://localhost:12700'
  };

  environment.rootPath = rootPath;
  environment.port = env.PORT || env.NODE_PORT || environment.port;
  environment.url = env.NODE_URL || environment.url;
  environment.mongo = env.MONGODB_URI || environment.mongo;

  if( env.NODE_ENV === 'production'){
    delete environment.url;
  }

  return environment;
};