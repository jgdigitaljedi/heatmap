angular.module('heatMap', 
	[
		'ui.router',
		'ngMaterial'
	]
)
.config(['$urlRouterProvider', '$locationProvider', '$mdThemingProvider', function ($urlRouterProvider, $locationProvider, $mdThemingProvider) {
	$urlRouterProvider
        .otherwise('/');

    $locationProvider.html5Mode(true);

    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange')
        .warnPalette('red');

    $mdThemingProvider.enableBrowserColor({theme: 'default'});
}]);
'use strict()';

angular.module('heatMap').controller('MainCtrl', ['$scope', '$http', '$state', 'WebService',
    function ($scope, $http, $state, WebService) {
    	var vm = this;
    	$state.go('main');
        vm.valProp = 'Site Incident Heat Severity Map (lv12)';
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
'use strict()';

angular.module('heatMap').directive('rawHeatmap', [
	function () {
		return {
			restrict: 'AE',
			transclude: true,
			scope: {
				hmData: '=',
				axisLabels: '=',
				valueProp: '='
			},
			templateUrl: 'app/directives/rawHeatmapTemplate.html',
			link: function (scope, elem, attrs) {
				scope.severity = 0;
				scope.hmDataSource = {};
				var colorArr = ['#01579B', '#006064', '#004D40', '#1B5E20', '#33691E', '#827717', '#F57F17', '#FF6F00', '#E65100', '#B71C1C'];
				var uniqueId = 0;

				function associateColor (value) {
					var index;
					if (value >= 680) {
						index = 9;
					} else {
						index = parseInt(value / 68);
					}
					return index;
				}

				if (window.innerWidth <= 884) {
					scope.skip = true;
					scope.xLabelWidth = '82px';
				} else {
					scope.skip = false;
					scope.xLabelWidth = '88px';
				}

				function createHeatmap (data) {
					var expectedLength = scope.axisLabels.xAxis.length,
						durationArray = Array.apply(null, {length: expectedLength}).map(Number.call, Number);
					if (data && data.length) {
						data.forEach(function (item, index) {
							var value = item.data[scope.valueProp][0].value;
							if (!scope.hmDataSource.hasOwnProperty(item.index.dowId)) {
								scope.hmDataSource[item.index.dowId] = {rowLabel: scope.axisLabels.yAxis[item.index.dowId - 1], data: []};
							}
							var cIndex = associateColor(value);
							scope.hmDataSource[item.index.dowId].data.push({
								hour: item.index.hourId,
								value: value,
								xLabel: scope.axisLabels.xAxis[item.index.hourId],
								color: colorArr[cIndex],
								colorIndex: cIndex
							});

						});
						for (var key in scope.hmDataSource) {
							var cleanedData = [],
								dataLen = scope.hmDataSource[key].data.length,
								counter = 0;
							scope.hmDataSource[key].data = scope.hmDataSource[key].data.sort(
								function (a, b) {
									return a.hour - b.hour;
								}
							);
							// console.log('before cleaning', angular.copy(scope.hmDataSource));
							for (var i = 0; i < expectedLength; i++) {
								if (counter < dataLen && i === scope.hmDataSource[key].data[counter].hour) {
									scope.hmDataSource[key].data[counter].id = uniqueId;
									cleanedData.push(scope.hmDataSource[key].data[counter]);
									uniqueId++;
									counter++;
								} else {
									cleanedData.push({
										color: colorArr[0],
										hour: i,
										value: 0,
										xLabel: scope.axisLabels.xAxis[i],
										colorIndex: 0,
										id: uniqueId
									});
									uniqueId++;
								}
							}
							scope.hmDataSource[key].data = cleanedData;
						}				
					}
				}

				scope.showPopover = function (e, index) {
					scope.style = {
						'left': e.pageX - 40 + 'px',
						'top': e.pageY - 40 + 'px'
					};
					scope.showWhich = index.id;
				};

				scope.hidePopover = function (id) {
					scope.showWhich = null;
				};

				scope.$watch('hmData', function () {
					createHeatmap(scope.hmData);
				});
			}
		};
	}
]);
'use strict()';

angular.module('heatMap')
  	.config(['$stateProvider', function ($stateProvider) {
    	$stateProvider
      		.state('main', {
        		url: '/',
        		templateUrl: 'app/views/mainView.html',
        		controller: 'MainCtrl',
        		controllerAs: 'vm'
      		});

    }]);
'use strict()';

angular.module('heatMap').factory('WebService', ['$http', '$q',
	function ($http, $q) {
		function getHeatmapData (random) {
			var def = $q.defer();
			$http.get('http://localhost:3000/api/getheatmapdata/' + random)
				.success(function (data, status, headers, config) {
					if (!data.error && data.data && data.data.result) {
						def.resolve(data.data.result);
					} else {
						def.resolve(data);
					}
				})
				.error(function (data, status, headers, config) {
					console.log('error', data);
					def.resolve(data);
				});
			return def.promise;
		}

		return {
			getHeatmapData: getHeatmapData
		};
	}
]);