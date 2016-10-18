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
  environment.port = env.NODE_PORT || environment.port;
  environment.url = env.NODE_URL || environment.url;
  environment.mongo = env.MONGOLAB_URI || environment.mongo;

  return environment;
};