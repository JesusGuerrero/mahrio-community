'use strict';

module.exports = function( server ) {
  server.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: ['../public/bower_components/','../public']
      }
    }
  });
  server.route({
    method: 'GET',
    path: '/{any*}',
    handler: function( request, reply ) {
      reply.view('index');
    }
  });
};