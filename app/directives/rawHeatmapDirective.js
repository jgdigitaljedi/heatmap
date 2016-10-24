'use strict()';

angular.module('heatMap').directive('rawHeatmap', [
	function () {
		return {
			restrict: 'AE',
			transclude: true,
			scope: {
				hmData: '=',
				axisLabels: '='
			},
			templateUrl: 'app/directives/rawHeatmapTemplate.html',
			link: function ($scope, elem, attrs) {
				$scope.severity = 0;
				$scope.hmDataSource = {};
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

				function createHeatmap (data) {
					var expectedLength = $scope.axisLabels.xAxis.length,
						durationArray = Array.apply(null, {length: expectedLength}).map(Number.call, Number);
					if (data && data.length) {
						data.forEach(function (item, index) {
							var value = item.data['Site Incident Heat Severity Map (lv12)'][0].value;
							if (!$scope.hmDataSource.hasOwnProperty(item.index.dowId)) {
								$scope.hmDataSource[item.index.dowId] = {rowLabel: $scope.axisLabels.yAxis[item.index.dowId - 1], data: []};
							}
							var cIndex = associateColor(value);
							$scope.hmDataSource[item.index.dowId].data.push({
								hour: item.index.hourId,
								value: value,
								xLabel: $scope.axisLabels.xAxis[item.index.hourId],
								color: colorArr[cIndex],
								colorIndex: cIndex
							});

						});
						for (var key in $scope.hmDataSource) {
							var cleanedData = [],
								dataLen = $scope.hmDataSource[key].data.length,
								counter = 0;
							$scope.hmDataSource[key].data = $scope.hmDataSource[key].data.sort(
								function (a, b) {
									return a.hour - b.hour;
								}
							);
							// console.log('before cleaning', angular.copy($scope.hmDataSource));
							for (var i = 0; i < expectedLength; i++) {
								if (counter < dataLen && i === $scope.hmDataSource[key].data[counter].hour) {
									$scope.hmDataSource[key].data[counter].id = uniqueId;
									cleanedData.push($scope.hmDataSource[key].data[counter]);
									uniqueId++;
									counter++;
								} else {
									cleanedData.push({
										color: colorArr[0],
										hour: i,
										value: 0,
										xLabel: $scope.axisLabels.xAxis[i],
										colorIndex: 0,
										id: uniqueId
									});
									uniqueId++;
								}
							}
							$scope.hmDataSource[key].data = cleanedData;
						}				
					}
				}

				$scope.showPopover = function (e, index) {
					console.log('e', e);
					$scope.style = {
						'left': e.pageX - 40 + 'px',
						'top': e.pageY - 40 + 'px'
					};
					$scope.left = e.pageX + 'px';
					$scope.top = e.pageY - 20 + 'px';
					$scope.showWhich = index.id;
				};

				$scope.hidePopover = function (id) {
					$scope.showWhich = null;
				};

				$scope.$watch('hmData', function () {
					createHeatmap($scope.hmData);
				});
			}
		};
	}
]);