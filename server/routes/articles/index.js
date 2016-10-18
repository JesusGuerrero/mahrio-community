'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    deck: { type: String },
    type: { type: String, default: 'Article' },
    coverImage: { type: String },
    media: [{ type: String }],
    body: { type: String, required: true },
    created: { type: Date, default: Date.now },
    published: { type: Boolean, default: false },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }),
  Article = mongoose.model('Article', schema),
  Boom = require('boom');

module.exports = function(server) {
  [{
    method: 'GET',
    path: '/article/{link?}',
    config: {
      handler: function ( request, reply ) {
        Article.findOne({
          link: request.params.link
        }).exec( function( err, article ) {
          if( !article ) {
            reply.view('article/not-found');
          } else {
            reply.view('article/index', {
              article: article
            });
          }
        });
      }
    }
  }, {
    method: ['GET','POST'],
    path: '/api/articles',
    config: {
      handler: function( request, reply ) {
        if( request.method === 'post' ) {
          Article.create( request.payload.article, function ( err ) {
            if( err ) { return Boom.badRequest(err); }

            reply({created: true});
          });
        } else {
          Article.find().exec( function(err, articles) {
            if( err ) { return Boom.badRequest(err); }

            reply({articles: articles});
          });
        }
      }
    }
  }, {
    method: ['PUT','DELETE'],
    path: '/api/articles/{id?}',
    config: {
      handler: function( request, reply ) {
        if( request.method === 'put' ) {
          Article.update({_id: request.params.id}, request.payload.article, {
            upsert: false
          }).exec( function(err, article){
            if( err ) { return Boom.badRequest(err); }

            if( article && article.ok && article.nModified ) {
              reply({updated: true});
            } else {
              reply({updated: false});
            }
          });
        } else {
          Article.remove({_id: request.params.id}).exec( function(err, article) {
            if( err ) { return Boom.badRequest(err); }

            if( article && article.ok && article.nModified ) {
              reply({deleted: true});
            } else {
              reply({deleted: false});
            }
          });
        }
      }
    }
  }].forEach(function (route) { server.route(route); });
};