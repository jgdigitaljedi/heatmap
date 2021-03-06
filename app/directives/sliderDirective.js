'use strict()';

angular.module('heatMap').directive('rangeSlider', [
	function () {
		return {
			restrict: 'AE',
			transclude: true,
			scope: {
				severity: '=',
				options: '='
			},
			controller: function ($scope, $element, $attrs) {

				var c = $element[0];
				var ctx = c.getContext('2d');
				var sliderTracker = {
					x: 110,
					y: 0,
					w: 8,
					h: 20
				};
				var ticksArr = [];
				var totalWidth = $scope.options.width - 130;
				var isDrag = false;

				// text label
				ctx.fillStyle = '#333';
				ctx.font = '16px Arial';
				ctx.fillText($scope.options.sliderTitle, 10, 16, 100);

				//track
				function makeTrack () {
					ctx.beginPath();
					ctx.rect(110, 8, $scope.options.width - 130, 4);
					ctx.fillStyle = $scope.options.trackColor;
					ctx.fill();
					ctx.closePath();					
				}

				//ticks
				function makeTicks () {
					var spacing = totalWidth / ($scope.options.increments - 1);
					for (var i = 0; i < $scope.options.increments; i++) {
						ctx.beginPath();
						ctx.rect(i * spacing + 110, 2.5, 2, 15);
						ctx.fillStyle = $scope.options.trackColor;
						ctx.fill();
						ctx.closePath();
						ticksArr.push(i * spacing + 110);
					}
				}

				//handle
				function makeHandle () {
					if ($scope.options.handleShape === 'rectangle') {
						ctx.beginPath();
						ctx.rect(sliderTracker.x, sliderTracker.y, sliderTracker.w, sliderTracker.h);
						ctx.fillStyle = $scope.options.handleColor;
						ctx.fill();
						ctx.closePath();						
					} else {
						ctx.beginPath();
						ctx.arc(sliderTracker.x + 4, sliderTracker.y + 10, sliderTracker.w, 0, 2 * Math.PI, false);
						ctx.fillStyle = $scope.options.handleColor;
						ctx.fill();
						ctx.closePath();						
					}
				}

				// moves slider to closest tick
				function snapTo (mouseX) {
					var closestTick = {distance: $scope.options.width - 130, tick: null},
						i = 0;
					ticksArr.forEach(function (item, index) {
						var distance = Math.abs(mouseX - item);
						if (distance < closestTick.distance) {
							closestTick.distance = distance;
							closestTick.tick = item;
							i = index;
						}
					});
					sliderTracker.x = closestTick.tick - 3;
					$scope.$apply(function () {
						$scope.severity = i;
					});
			      	makeHandle();
				}

				// click handler
				c.onmousedown = function (e) {
					var rect = this.getBoundingClientRect(),
					    mouseX = e.clientX - rect.left - 4,
					    mouseY = e.clientY - rect.top;

			      	if (mouseX >= sliderTracker.x && mouseX <= (sliderTracker.x + sliderTracker.w)) {
			      		isDrag = true;
			      	} else {
			      		ctx.clearRect(sliderTracker.x - 20, sliderTracker.y, sliderTracker.w + 50, sliderTracker.h);
			      		sliderTracker.x = mouseX;
			      		makeTrack();
			      		makeTicks();
			      		makeHandle();
			      	}
				};

				c.onmouseup = function (e) {
					var rect = this.getBoundingClientRect(),
					    mouseX = e.clientX - rect.left;
				    ctx.clearRect(sliderTracker.x - 20, sliderTracker.y, sliderTracker.w + 100, sliderTracker.h);
					isDrag = false;
					makeTrack();
					makeTicks();
					snapTo(mouseX);
				};

				c.onmousemove = function (e) {
					if (isDrag) {
					    ctx.clearRect(sliderTracker.x - 20, sliderTracker.y, sliderTracker.w + 100, sliderTracker.h);
						var rect = this.getBoundingClientRect(),
					    mouseX = e.clientX - rect.left;
					    sliderTracker.x = mouseX;

					    makeTrack();
					    makeTicks();
						makeHandle();
					}
				};

				// init
				makeTrack();
				makeTicks();
				makeHandle();
			}
		};
	}
]);