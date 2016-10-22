'use strict()';

angular.module('heatMap').controller('MainCtrl', ['$scope', '$http', '$state', 'WebService',
    function ($scope, $http, $state, WebService) {
    	var vm = this;
    	$state.go('main');
    	//the label definition is here to show that you can send whatever you like for labels
        /***************** 1st widget params ******************************/
        vm.axisLabels = {
            yAxis: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            xAxis: ['1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p', '12a']
        };
        WebService.getHeatmapData(false).then(function (data) {
            if (!data.error) {
                vm.hmData = data;               
            } else {
                // some error handling stuff here
            }
        });

        /***************** 2nd widget params ******************************/
        vm.axisLabelsOther = {
            yAxis: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            xAxis: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
        };
        WebService.getHeatmapData(true).then(function (data) {
            if (!data.error) {
                vm.hmDataOther = data;        
            } else {
                // some error handling stuff here
            }
        });
    }
]);