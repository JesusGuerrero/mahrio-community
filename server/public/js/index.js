var socket = io();

socket.on('connect', function(){
  console.log('We have connected to sockets');
});

var ng = angular.module('mahrio-community', []);