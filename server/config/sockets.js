'use strict';

var io = null;

module.exports = function( server ){
  io = require('socket.io').listen( server.listener );

  io.on('connection', function( socket ){
    console.log('socket listening...' + socket.id);

    socket.on( 'disconnect', function(){
      console.log('goodbye socket...' + socket.id );
    });
  });

  return io;
};