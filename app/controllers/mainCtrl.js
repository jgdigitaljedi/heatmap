'use strict()';

angular.module('heatMap').controller('MainCtrl', ['$scope', '$http', '$state', 'WebService',
    function ($scope, $http, $state, WebService) {
    	var vm = this;
    	$state.go('main');
    	vm.axisLabels = {
    		xAxis: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
    		yAxis: ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '12p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p']
    	};
    	WebService.getHeatmapData().then(function (data) {
    		if (!data.error) {
    			vm.hmData = data;    			
    		} else {
    			// some error handling stuff here
    		}
    	});
    }
]);