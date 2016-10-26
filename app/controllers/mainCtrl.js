'use strict()';

angular.module('heatMap').controller('MainCtrl', ['$scope', '$http', '$state', 'WebService', '$q',
    function ($scope, $http, $state, WebService, $q) {
    	var vm = this;
    	$state.go('main');
        vm.valProp = 'Site Incident Heat Severity Map (lv12)';
        vm.colorArr = ['#01579B', '#006064', '#004D40', '#1B5E20', '#33691E', '#827717', '#F57F17', '#FF6F00', '#E65100', '#B71C1C'];

        // function associateColor (value) {
        //     var index;
        //     if (value >= 680) {
        //         index = 9;
        //     } else {
        //         index = parseInt(value / 68);
        //     }
        //     return index;
        // }

        // function finishFormattingData (unformatted) {
        //     var def = $q.defer();
        //     for (var obj in unformatted) {
        //         console.log('data', unformatted);
        //         console.log('obj', obj);
        //         unformatted[obj].data.forEach(function (item, index) {
        //             var correctColor = 
        //             console.log('item', item);
        //         });
        //     }
        //     return def.promise;
        // }

        // function formatDataForDirective (data, labels) {
        //     var def = $q.defer();
        //     if (data && data.length) {
        //         var result = {},
        //             expectedLength = labels.xAxis.length,
        //             uniqueId = 0;
        //         data.forEach(function (item, index) {
        //             var value = item.data[vm.valProp][0].value;
        //             if (!result.hasOwnProperty(item.index.dowId)) {
        //                 result[item.index.dowId] = {rowLabel: labels.yAxis[item.index.dowId - 1], data: []};
        //             }
        //             var cIndex = associateColor(value);
        //             result[item.index.dowId].data.push({
        //                 hour: item.index.hourId,
        //                 value: value,
        //                 xLabel: labels.xAxis[item.index.hourId],
        //                 color: colorArr[cIndex],
        //                 colorIndex: cIndex
        //             });

        //         });
        //         for (var key in result) {
        //             var cleanedData = [],
        //                 dataLen = result[key].data.length,
        //                 counter = 0;
        //             result[key].data = result[key].data.sort(
        //                 function (a, b) {
        //                     return a.hour - b.hour;
        //                 }
        //             );
        //             // console.log('before cleaning', angular.copy(result));
        //             for (var i = 0; i < expectedLength; i++) {
        //                 if (counter < dataLen && i === result[key].data[counter].hour) {
        //                     result[key].data[counter].id = uniqueId;
        //                     cleanedData.push(result[key].data[counter]);
        //                     uniqueId++;
        //                     counter++;
        //                 } else {
        //                     cleanedData.push({
        //                         color: colorArr[0],
        //                         hour: i,
        //                         value: 0,
        //                         xLabel: labels.xAxis[i],
        //                         colorIndex: 0,
        //                         id: uniqueId
        //                     });
        //                     uniqueId++;
        //                 }
        //             }
        //             result[key].data = cleanedData;
        //         }
        //         def.resolve(result);
        //     } else {
        //         def.reject(false);
        //     }
        //     return def.promise;

        // }

    	//the label definition is here to show that you can send whatever you like for labels
        /***************** 1st widget params ******************************/
        vm.axisLabels = {
            yAxis: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            xAxis: ['1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p', '12a']
        };
        WebService.getHeatmapData(false, vm.axisLabels).then(function (data) {
            if (!data.error) {
                // finishFormattingData(data).then(function (result) {
                    vm.hmData = data;

                // });
                console.log('data', data);
                // formatDataForDirective(data, vm.axisLabels).then(function (result) {
                //     vm.hmData = result;
                //     console.log('result', result);
                // });               
            } else {
                // some error handling stuff here
            }
        });

        /***************** 2nd widget params ******************************/
        vm.axisLabelsOther = {
            yAxis: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            xAxis: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
        };
        WebService.getHeatmapData(true, vm.axisLabelsOther).then(function (data) {
            if (!data.error) {
                vm.hmDataOther = data;
                console.log('other data', data);
                // formatDataForDirective(data, vm.axisLabelsOther).then(function (result) {
                // });
            } else {
                // some error handling stuff here
            }
        });
    }
]);