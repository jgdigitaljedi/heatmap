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
			link: function (scope, elem) {
				scope.hmDataSource = {};
				var colorArr = ['#01579B', '#006064', '#004D40', '#1B5E20', '#33691E', '#827717', '#F57F17', '#FF6F00', '#E65100', '#B71C1C'];

				function associateColor (value) {
					return parseInt(value / 67);
				}

				function createHeatmap (data) {
					if (data && data.length) {
						data.forEach(function (item, index) {
							var value = item.data['Site Incident Heat Severity Map (lv12)'][0].value;
							// console.log(item.data['Site Incident Heat Severity Map (lv12)'][0].value);
							if (!scope.hmDataSource.hasOwnProperty(item.index.dowId)) {
								scope.hmDataSource[item.index.dowId] = [];
							}
							scope.hmDataSource[item.index.dowId].push({
								hour: item.index.hourId,
								value: value,
								xLabel: scope.axisLabels.xAxis[item.index.dowId - 1],
								yLabel: scope.axisLabels.yAxis[item.index.hourId],
								color: colorArr[associateColor(value)]
							});

						});
						console.log('end result', scope.hmDataSource);					
					}
				}

				scope.$watch('hmData', function () {
					createHeatmap(scope.hmData);
				});
			}
		};
	}
]);