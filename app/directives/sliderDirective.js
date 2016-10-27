'use strict()';

angular.module('heatMap').directive('rangeSlider', [
	function () {
		return {
			restrict: 'AE',
			transclude: true,
			scope: {
				minMax: '=',
				severity: '='
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
				var totalWidth = 720;
				var isDrag = false;

				// text label
				ctx.fillStyle = '#333';
				ctx.font = '16px Arial';
				ctx.fillText('Severity', 10, 16, 100);

				//track
				function makeTrack () {
					ctx.beginPath();
					ctx.rect(110, 8, 720, 4);
					ctx.fillStyle = '#B0BEC5';
					ctx.fill();
					ctx.closePath();					
				}

				//ticks
				function makeTicks () {
					var spacing = totalWidth / ($scope.minMax.total - 1);
					for (var i = 0; i < $scope.minMax.total; i++) {
						ctx.beginPath();
						ctx.rect(i * spacing + 110, 2.5, 2, 15);
						ctx.fillStyle = '#B0BEC5';
						ctx.fill();
						ctx.closePath();
						ticksArr.push(i * spacing + 110);
					}
				}

				//handle
				function makeHandle () {
					ctx.beginPath();
					ctx.rect(sliderTracker.x, sliderTracker.y, sliderTracker.w, sliderTracker.h);
					ctx.fillStyle = '#311B92';
					ctx.fill();
					ctx.closePath();					
				}

				// moves slider to closest tick
				function snapTo (mouseX) {
					var closestTick = {distance: 720, tick: null},
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
			      		console.log('clicked on slider');
			      		isDrag = true;
			      	} else {
			      		ctx.clearRect(sliderTracker.x - 20, sliderTracker.y, sliderTracker.w + 50, sliderTracker.h);
			      		sliderTracker.x = mouseX;
			      		makeTrack();
			      		makeTicks();
			      		// snapTo(mouseX);
			      	}
				};

				c.onmouseup = function (e) {
					var rect = this.getBoundingClientRect(),
					    mouseX = e.clientX - rect.left;
					isDrag = false;
					snapTo(mouseX);
				};

				c.onmousemove = function (e) {
					if (isDrag) {
						console.log('dragging');
					    ctx.clearRect(sliderTracker.x - 20, sliderTracker.y, sliderTracker.w + 100, sliderTracker.h);
						console.log('dragging');
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