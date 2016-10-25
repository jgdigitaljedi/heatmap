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
					var toolTipCoords = {};

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

						var y, hotspots = [];
						scope.axisLabels.yAxis.forEach(function (item, index) {
							y = (index + 1) * 30;

							// x-axis labels
							ctx.fillStyle = '#333';
							ctx.font = 'bold 16px Arial';
							ctx.fillText(item, 10, y, 100);

							// row of colored squares
							var x = 110;
							scope.hmDataSource[index+1].data.forEach(function (ite, idx) {
								ctx.beginPath();
								ctx.rect(x, y - 25, 30, 30);
								ctx.fillStyle = ite.color;
								ctx.fill();
								hotspots.push({x: x, y: y-25, w: 30, h: 30, tip: 'Value: ' + ite.value});
								x += 30;
								ctx.closePath();
							});


						});

						ctx.strokeRect(10, y+5, 100, 33);
						toolTipCoords.x = 10;
						toolTipCoords.y = y+5;
						toolTipCoords.width = 100;
						toolTipCoords.height = 33;


						var bottomX = 115;
						scope.axisLabels.xAxis.forEach(function (item, index) {
							// y-axis labels
							ctx.fillStyle = '#333';
							ctx.font = '16px Arial';
							ctx.fillText(item, bottomX, y+30, 30);
							bottomX += 30;
						});				
					}

					c.onmousemove = function (e) {
						var rect = this.getBoundingClientRect(),
						    mouseX = e.clientX - rect.left,
						    mouseY = e.clientY - rect.top;

				      	if (mouseX >= 110 && mouseX <= (scope.axisLabels.xAxis.length * 30 + 110) && mouseY >= 5 && mouseY <= (scope.axisLabels.yAxis.length * 30 + 5)) {
					      	for (var i = 0; i < hotspots.length; i++) {
					      		if (mouseX >= hotspots[i].x && mouseX <= hotspots[i].x + 30 && mouseY >= hotspots[i].y && mouseY <= hotspots[i].y + 30) {
					      			// console.log('this', hotspots[i].tip);
					      			scope.hoverValue = hotspots[i].tip;
					      			ctx.clearRect(toolTipCoords.x, toolTipCoords.y, toolTipCoords.width, toolTipCoords.height);
					      			ctx.fillStyle = '#333';
									ctx.font = 'bold 16px Arial';
									ctx.fillText(hotspots[i].tip, toolTipCoords.x+10, toolTipCoords.y+22, 100);
					      		}

					      	}				      		
				      	} else {
				      		ctx.clearRect(toolTipCoords.x, toolTipCoords.y, toolTipCoords.width, toolTipCoords.height);
				      	}
					    
					};
				}

				scope.$watch('hmData', function () {
					createHeatmap(scope.hmData);
				});
			}
		};
	}
]);