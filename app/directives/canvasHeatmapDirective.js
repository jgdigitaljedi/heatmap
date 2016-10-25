'use strict()';

angular.module('heatMap').directive('canvasHeatmap', [
	function () {
		return {
			restrict: 'AE',
			transclude: true,
			scope: {
				hmData: '=',
				axisLabels: '=',
				valueProp: '='
			},
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
					var expectedLength = scope.axisLabels.xAxis.length;
					var c = elem[0];
					var ctx = c.getContext('2d');

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

						scope.axisLabels.yAxis.forEach(function (item, index) {
							console.log('item', item);
							var y = (index + 1) * 30;
							ctx.fillStyle = '#333';
							ctx.font = 'bold 16px Arial';
							ctx.fillText(item, 10, y, 100);
						});				
					}
				}

				// scope.showPopover = function (e, index) {
				// 	scope.style = {
				// 		'left': e.pageX - 40 + 'px',
				// 		'top': e.pageY - 40 + 'px'
				// 	};
				// 	scope.showWhich = index.id;
				// };

				// scope.hidePopover = function (id) {
				// 	scope.showWhich = null;
				// };

				scope.$watch('hmData', function () {
					createHeatmap(scope.hmData);
				});
			}
		};
	}
]);