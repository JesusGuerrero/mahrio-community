'use strict';

var mongoose = require('mongoose'),
  schema = mongoose.Schema({
    title: { type: String, required: true },
    link: { type: String, required: true, unique: true },
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
    method: ['GET','POST'],
    path: '/articles/{link?}',
    config: {
      handler: function ( request, reply ) {
        if( request.params.link ) {
          Article.findOne({
            link: request.params.link
          }).exec( function( err, article ) {
            if( !article ) {
              reply.view('articles/not-found');
            } else {
              reply.view('articles/one', {
                article: article
              });
            }
          });
        } else {
          if( request.method === 'post' ) {
            Article.create( request.payload.article, function ( err ) {
              if( err ) {
                if( 11000 === err.code || 11001 === err.code ) {
                  return reply( Boom.badRequest("Duplicate key error index") );
                } else {
                  return reply( Boom.badRequest(err) );
                }
              }
              reply({created: true});
            });
          } else {
            Article.find().exec( function(err, articles) {
              if( err ) { return reply( Boom.badRequest(err) ); }

              if( request.query.type === 'json' ) {
                reply({articles: articles});
              } else {
                reply.view('articles/index', {
                  articles: articles
                });
              }
            });
          }
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
            if( err ) {
              if( 11000 === err.code || 11001 === err.code ) {
                return reply( Boom.badRequest("Duplicate key error index") );
              } else {
                return reply( Boom.badRequest(err) );
              }
            }
            if( article && article.ok && article.nModified ) {
              reply({updated: true});
            } else {
              reply({updated: false});
            }
          });
        } else {
          Article.remove({_id: request.params.id}).exec( function(err, article) {
            if( err ) { return reply( Boom.badRequest(err) ); }

            if( article && article.result && article.result.ok ) {
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