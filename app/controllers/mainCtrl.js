'use strict()';
/*jshint loopfunc: true */

angular.module('heatMap').controller('MainCtrl', ['$scope', '$http', '$state', 'WebService', '$q',
    function ($scope, $http, $state, WebService, $q) {
    	var vm = this;
    	$state.go('main');
        vm.valProp = 'Site Incident Heat Severity Map (lv12)';
        vm.colorArr = ['#01579B', '#006064', '#004D40', '#1B5E20', '#33691E', '#827717', '#F57F17', '#FF6F00', '#E65100', '#B71C1C'];
        vm.altColorArr = ['#26C6DA', '#26A69A', '#66BB6A', '#9CCC65', '#D4E157', '#FFEE58', '#FFCA28', '#FFA726','#FF7043', '#EF5350'];
        $scope.severity = 0;
        vm.minMax = {
            min: 0,
            max: 9,
            step: 1,
            total: 10
        };

        $scope.currentValue = 0;
        vm.options = {
            thresh: 680,
            increments: 10,
            width: 850
        };


        //the label definition is here to show that you can send whatever you like for labels
        /***************** 1st widget params ******************************/
        vm.axisLabels = {
            yAxis: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            xAxis: ['1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p', '12a']
        };
        WebService.getHeatmapData(false, vm.axisLabels, 'value').then(function (data) {
            if (!data.error) {
                console.log('data', data);
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
        WebService.getHeatmapData(true, vm.axisLabelsOther, 'value').then(function (data) {
            if (!data.error) {
                vm.hmDataOther = data;
            } else {
                // some error handling stuff here
            }
        });

        /****for the sake of brevity, I'm going to just randomly generate a data object for the last canvas element***/
        vm.thirdColorArr = ['#D50000', '#C51162', '#4A148C', '#311B92','#1A237E', '#0D47A1', '#0091EA', '#00B8D4', '#00BFA5', '#1B5E20', '#33691E', '#827717'];
        vm.crazyAxis = {
            yAxis: ['Mario', 'Luigi', 'Peach', 'Toad', 'Yoshi', 'Bowser', 'Boo'],
            xAxis: Array.apply(null, {length: 30}).map(Number.call, Number)
        };

        var cData = {
            1: {
                data: [],
                rowLabel: 'Mario'
            },
            2: {
                data: [],
                rowLabel: 'Luigi'
            },
            3: {
                data: [],
                rowLabel: 'Peach'
            },
            4: {
                data: [],
                rowLabel: 'Toad)'
            },
            5: {
                data: [],
                rowLabel: 'Yoshi'
            },
            6: {
                data: [],
                rowLabel: 'Bowser'
            },
            7: {
                data: [],
                rowLabel: 'Boo'
            },
        };

        // vm.crazyData = Array.apply(null, new Array(vm.crazyAxis.yAxis.length)).map(function (item, index) {
        for (var key in cData) {
            cData[key].data =   Array.apply(null, new Array(30)).map(function (item, index) {
                                    return {
                                        hour: index,
                                        value: Math.floor(Math.random() * 1000),
                                        xLabel: vm.crazyAxis.xAxis[index]
                                    };
                                });
        }
        vm.crazyData = cData;
            
        // });
        vm.crazyOptions = {
            thresh: 920,
            increments: 12,
            width: 1050
        };
        $scope.crazyValue = 0;
    }
]);