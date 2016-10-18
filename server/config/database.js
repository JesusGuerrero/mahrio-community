'use strict';

var mongoose = require('mongoose');

module.exports = function ( config ) {
  mongoose.connect(config.mongo);

  mongoose.Promise = require('bluebird');

  var db = mongoose.connection;
  db.on('error', function(){
    console.error('db connection error...');
  });
  db.once('open', function () {
    console.log('db connection opened');
  });
};