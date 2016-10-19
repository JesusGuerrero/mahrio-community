'use strict';

angular.module('Articles', ['ngRoute','textAngular'])
  .config( function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl : '/assets/ng/articles/list.html'
      })
      .when('/new',{
        templateUrl: '/assets/ng/articles/new.html'
      })
      .when('/:link', {
        templateUrl : '/assets/ng/articles/show.html'
      })
      .when('/:link/edit', {
        templateUrl : '/assets/ng/articles/edit.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$rootScope', '$location', function($rootScope, $location){
    $rootScope.goTo = function( path ){
      $location.path( path );
    };
  }])
  .controller('AppCtrl', [function(){
    var that = this;
  }])
  .controller('ListCtrl', ['$http',function($http){
    var that = this;

    $http.get('/articles?type=json')
      .then( function(res){
        that.articles = res.data.articles;
      });

    that.delete = function( id, index ) {
      $http.delete('/api/articles/' + id)
        .then( function(res){
          that.articles.splice(index, 1);
        });

    };
  }])
  .controller('NewCtrl', ['$rootScope', '$http', function( $rootScope, $http ){
    var that = this;

    that.article = {};

    that.submitArticle = function(){
      $http.post('/api/articles', {article: that.article})
        .then( function(res){
          $rootScope.goTo( '/' );
        }, function(){

        })
    };
  }])
  .controller('ShowCtrl', ['$http','$routeParams', function($http, $routeParams){
    var that = this;

    $http.get('/articles/'+ $routeParams.link + '?type=json' )
      .then( function(res){
        that.article = res.data.article;
      }, function(){

      });
  }])
  .controller('EditCtrl', ['$rootScope', '$http','$routeParams', function($rootScope, $http, $routeParams){
    var that = this;

    $http.get('/articles/' + $routeParams.link + '?type=json' )
      .then( function(res){
        that.article = res.data.article;
      });

    that.submitArticle = function(){
      $http.put('/api/articles/'+that.article._id, {article: that.article})
        .then( function(res){
          $rootScope.goTo( '/' );
        }, function(err){
          console.log(err);
        })
    };
  }])
  .directive('articleForm', [function(){
    return {
      restrict: 'E',
      templateUrl: '/assets/ng/articles/_form.html',
      scope: {
        vm: '='
      },
      link: function(){

      }
    };
  }]);