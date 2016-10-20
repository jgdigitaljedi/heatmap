'use strict';

angular.module('heatMap')
  	.config(function ($stateProvider) {
    	$stateProvider
      		.state('main', {
        		url: '/',
        		templateUrl: 'app/views/mainView.html',
        		controller: 'MainCtrl',
        		controllerAs: 'mainVm'
      		});

    });