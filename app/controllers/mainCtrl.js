'use strict';

angular.module('heatMap')
    .controller('MainCtrl', function ($scope, $http, $state) {
    	$state.go('main');
    });