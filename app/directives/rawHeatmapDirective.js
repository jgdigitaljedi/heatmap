'use strict()';

angular.module('heatMap').directive('rawHeatmap', [
	function () {
		return {
			restrict: 'AE',
			replace: true,
			transclude: true,
			scope: {
				hmData: '=',
				axisLabels: '='
			},
			templateUrl: 'app/directives/rawHeatmapTemplate.html',
			link: function ($scope, elem) {
				$scope.hmDataSource = {};
				var colorArr = ['#01579B', '#006064', '#004D40', '#1B5E20', '#33691E', '#827717', '#F57F17', '#FF6F00', '#E65100', '#B71C1C'];

				function associateColor (value) {
					return parseInt(value / 68);
				}

				function createHeatmap (data) {
					console.log('data', data);
					var expectedLength = $scope.axisLabels.xAxis.length,
						durationArray = Array.apply(null, {length: expectedLength}).map(Number.call, Number);
					if (data && data.length) {
						data.forEach(function (item, index) {
							var value = item.data['Site Incident Heat Severity Map (lv12)'][0].value;
							// console.log('value', value);
							// console.log('color', associateColor(value));
							if (!$scope.hmDataSource.hasOwnProperty(item.index.dowId)) {
								$scope.hmDataSource[item.index.dowId] = {rowLabel: $scope.axisLabels.yAxis[item.index.dowId - 1], data: []};
							}
							$scope.hmDataSource[item.index.dowId].data.push({
								hour: item.index.hourId,
								value: value,
								xLabel: $scope.axisLabels.xAxis[item.index.hourId],
								color: colorArr[associateColor(value)]
							});

						});
						console.log('before cleaning', angular.copy($scope.hmDataSource));
						for (var key in $scope.hmDataSource) {
							var cleanedData = [],
								dataLen = $scope.hmDataSource[key].data.length,
								counter = 0;
							for (var i = 0; i < expectedLength; i++) {
								if (i < dataLen && i === $scope.hmDataSource[key].data[counter].hour) {
									cleanedData.push($scope.hmDataSource[key].data[counter]);
									counter++;
								} else {
									cleanedData.push({
										// color: colorArr[0],
										color: '#333',
										hour: i,
										value: 0,
										xLabel: $scope.axisLabels.xAxis[i]
									});
								}
							}
							cleanedData = cleanedData.sort(
								function (a, b) {
									return a.hour - b.hour;
								}
							);
							$scope.hmDataSource[key].data = cleanedData;
						}
						console.log('end result', $scope.hmDataSource);					
					}
				}

				$scope.$watch('hmData', function () {
					createHeatmap($scope.hmData);
				});
			}
		};
	}
]);