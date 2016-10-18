'use strict';

module.exports = function( server ) {
  require('./articles/index')( server );

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
    path: '/',
    handler: function( request, reply ) {
      reply.view('index');
    }
  });
};