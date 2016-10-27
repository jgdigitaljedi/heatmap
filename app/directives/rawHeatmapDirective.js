'use strict()';
/*jshint loopfunc: true */

angular.module('heatMap').directive('rawHeatmap', [
	function () {
		return {
			restrict: 'AE',
			transclude: true,
			scope: {
				hmData: '=',
				axisLabels: '=',
				colorArr: '=',
				options: '='
			},
			templateUrl: 'app/directives/rawHeatmapTemplate.html',
			link: function (scope, elem, attrs) {
				scope.severity = 0;
				scope.hmDataSource = {};
				if (!scope.colorArr) scope.colorArr = ['#01579B', '#006064', '#004D40', '#1B5E20', '#33691E', '#827717', '#F57F17', '#FF6F00', '#E65100', '#B71C1C'];
				var divisor = scope.options.thresh / 10;

				function associateColor (value) {
					var index;
					if (value >= scope.options.thresh) {
						index = 9;
					} else {
						index = parseInt(value / divisor);
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

				function createHeatmap (info) {
					for (var obj in info) {
						info[obj].data.forEach(function (item, index) {
							var val = associateColor(item.value);
							item.colorIndex = val;
							item.color = scope.colorArr[val];
						});
					}
					scope.hmDataSource = info;
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