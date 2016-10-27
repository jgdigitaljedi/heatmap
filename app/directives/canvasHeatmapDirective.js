'use strict()';

angular.module('heatMap').directive('canvasHeatmap', [
	function () {
		return {
			restrict: 'AE',
			transclude: true,
			scope: {
				hmData: '=',
				axisLabels: '=',
				valueProp: '=',
				severity: '=severity',
				colorArr: '='
			},
			link: function (scope, elem, attrs) {
				scope.severity = 0;
				scope.hmDataSource = {};
				if (!scope.colorArr) scope.colorArr = ['#01579B', '#006064', '#004D40', '#1B5E20', '#33691E', '#827717', '#F57F17', '#FF6F00', '#E65100', '#B71C1C'];
				var uniqueId = 0;
				var expectedLength = scope.axisLabels.xAxis.length;
				var c = elem[0];
				var ctx = c.getContext('2d');
				var toolTipCoords = {};
				var y, hotspots = [];
				var bottomX = 115;

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

				function buildColorSquares () {
					if (scope.hmDataSource) {
						ctx.clearRect(110, 60, scope.axisLabels.xAxis.length * 30, scope.axisLabels.yAxis * 30);
						scope.axisLabels.yAxis.forEach(function (item, index) {
							y = (index + 1) * 30 + 30;

							// x-axis labels
							ctx.fillStyle = '#333';
							ctx.font = 'bold 16px Arial';
							ctx.fillText(item, 10, y, 100);

							// row of colored squares
							var x = 110;
							if (scope.hmDataSource[index+1]) {
								scope.hmDataSource[index+1].data.forEach(function (ite, idx) {
									var fillColor = ite.colorIndex >= scope.severity ? ite.color : '#333';
									ctx.beginPath();
									ctx.rect(x, y - 25, 30, 30);
									ctx.fillStyle = fillColor;
									ctx.fill();
									hotspots.push({x: x, y: y - 10, w: 30, h: 30, tip: 'Value: ' + ite.value});
									x += 30;
									ctx.closePath();
								});			
							}
						});					
					}
				}

				function buildRows () {
					buildColorSquares();
					// value area
					ctx.strokeRect(10, y+5, 100, 33);
					toolTipCoords.x = 10;
					toolTipCoords.y = y+5;
					toolTipCoords.width = 100;
					toolTipCoords.height = 33;
				}

				function buildXAxisLabels () {
					scope.axisLabels.xAxis.forEach(function (item, index) {
						// y-axis labels
						ctx.fillStyle = '#333';
						ctx.font = '16px Arial';
						ctx.fillText(item, bottomX, y+30, 30);
						bottomX += 30;
					});							
				}

				function buildWidget () {
					buildRows();
					buildXAxisLabels();
				}

				function createHeatmap (info) {
					for (var obj in info) {
						info[obj].data.forEach(function (item, index) {
							var val = associateColor(item.value);
							item.colorIndex = val;
							item.color = scope.colorArr[val];
						});
					}
					scope.hmDataSource = info;
					buildWidget();			
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

				scope.$watch('hmData', function () {
					createHeatmap(scope.hmData);
				});

				scope.$watch('severity', function () {
					buildColorSquares();
				});
			}
		};
	}
]);