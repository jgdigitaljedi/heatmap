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
}])
.run(['$window', '$rootScope',
    function ($window, $rootScope) {
        console.log('listening for Konami code');
        // konami code
        var neededkeys = [38,38,40,40,37,39,37,39,66,65],
            started = false,
            count = 0;

        //Function used to reset us back to starting point.
        function reset() {
            started = false; count = 0;
            return;
        }
        var bodyElement = angular.element($window);
        bodyElement.bind('keydown', function (e) {
            var key = e.keyCode;
            //Set start to true only if having pressed the first key in the konami sequence.
            if (!started){
                if (key === 38){
                    started = true;
                }
            }
            //If we've started, pay attention to key presses, looking for right sequence.
            if (started){
                if (neededkeys[count] === key){
                    //We're good so far.
                    count++;
                } else {
                    //Oops, not the right sequence, lets restart from the top.
                    reset();
                }
                if (count === 10){
                    //We made it!
                    $rootScope.$emit('konami');
                    //Reset the conditions so that someone can do it all again.
                    reset();
                }
            } else {
                //Oops.
                reset();
            }
        });
    }
]);
'use strict()';
/*jshint loopfunc: true */

angular.module('heatMap').controller('MainCtrl', ['$scope', '$http', '$state', 'WebService', '$q', '$rootScope', '$timeout',
    function ($scope, $http, $state, WebService, $q, $rootScope, $timeout) {
    	var vm = this;
    	$state.go('main');
        vm.colorArr = ['#01579B', '#006064', '#004D40', '#1B5E20', '#33691E', '#827717', '#F57F17', '#FF6F00', '#E65100', '#B71C1C'];
        vm.altColorArr = ['#26C6DA', '#26A69A', '#66BB6A', '#9CCC65', '#D4E157', '#FFEE58', '#FFCA28', '#FFA726','#FF7043', '#EF5350'];
        $scope.severity = 0;
        $scope.currentValue = 0;
        vm.options = {
            thresh: 680,
            increments: 10,
            width: 848,
            handleColor: '#311B92',
            trackColor: '#B0BEC5',
            sliderTitle: 'Severity'
        };
        vm.konami = false;


        //the label definition is here to show that you can send whatever you like for labels
        /***************** 1st widget params ******************************/
        vm.axisLabels = {
            yAxis: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            xAxis: ['1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p', '12a']
        };
        WebService.getHeatmapData(false, vm.axisLabels, 'value').then(function (data) {
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
        WebService.getHeatmapData(true, vm.axisLabelsOther, 'value').then(function (data) {
            if (!data.error) {
                vm.hmDataOther = data;
            } else {
                // some error handling stuff here
            }
        });

        /****for the sake of brevity, I'm going to just randomly generate a data object for the last canvas element***/
        vm.thirdColorArr = ['#D50000', '#C51162', '#4A148C', '#311B92','#1A237E', '#0D47A1', '#0091EA', '#00B8D4', '#00BFA5', '#1B5E20', '#33691E', '#827717'];
        vm.crazyAxis = {
            yAxis: ['Mario', 'Luigi', 'Peach', 'Toad', 'Yoshi', 'Bowser', 'Boo'],
            xAxis: Array.apply(null, {length: 30}).map(Number.call, Number)
        };

        var cData = {
            1: {
                data: [],
                rowLabel: 'Mario'
            },
            2: {
                data: [],
                rowLabel: 'Luigi'
            },
            3: {
                data: [],
                rowLabel: 'Peach'
            },
            4: {
                data: [],
                rowLabel: 'Toad)'
            },
            5: {
                data: [],
                rowLabel: 'Yoshi'
            },
            6: {
                data: [],
                rowLabel: 'Bowser'
            },
            7: {
                data: [],
                rowLabel: 'Boo'
            },
        };

        for (var key in cData) {
            cData[key].data =   Array.apply(null, new Array(30)).map(function (item, index) {
                                    return {
                                        hour: index,
                                        value: Math.floor(Math.random() * 1000),
                                        xLabel: vm.crazyAxis.xAxis[index]
                                    };
                                });
        }
        vm.crazyData = cData;
        vm.crazyOptions = {
            thresh: 920,
            increments: 12,
            width: 1028,
            handleColor: '#F57F17',
            trackColor: '#BCAAA4',
            sliderTitle: 'Stuff'
        };
        $scope.crazyValue = 0;

        // I can't help myself
        $rootScope.$on('konami', function () {
            $scope.$apply(function () {
                vm.konami = true;
                $timeout(function () {
                    window.scrollTo(0, window.innerHeight);
                }, 300);
            });
        });
    }
]);
'use strict()';
/*jshint loopfunc: true */

angular.module('heatMap').directive('canvasHeatmap', [
	function () {
		return {
			restrict: 'AE',
			transclude: true,
			scope: {
				hmData: '=',
				axisLabels: '=',
				options: '=',
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
				var divisor = scope.options.thresh / scope.options.increments;

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

				function buildColorSquares (refresh) {
					if (scope.hmDataSource) {
						ctx.clearRect(110, 60, scope.axisLabels.xAxis.length * 30, scope.axisLabels.yAxis * 30);
						scope.axisLabels.yAxis.forEach(function (item, index) {
							y = (index + 1) * 30 + 30;

							// y-axis labels
							if (!refresh) {
								ctx.fillStyle = '#333';
								ctx.font = 'bold 16px Arial';
								ctx.fillText(item, 10, y, 100);								
							}

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
					var bottomX = 115;
					scope.axisLabels.xAxis.forEach(function (item, index) {
						// x-axis labels
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

			      	if (mouseX >= 110 && mouseX <= (scope.axisLabels.xAxis.length * 30 + 110) && mouseY >= 5 && mouseY <= (scope.axisLabels.yAxis.length * 30 + 60)) {
				      	for (var i = 0; i < hotspots.length; i++) {
				      		if (mouseX >= hotspots[i].x && mouseX <= hotspots[i].x + 30 && mouseY >= hotspots[i].y && mouseY <= hotspots[i].y + 30) {
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
					buildColorSquares(true);
				});
			}
		};
	}
]);
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
				var divisor = scope.options.thresh / scope.options.increments;

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
			controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

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
					ctx.beginPath();
					ctx.rect(sliderTracker.x, sliderTracker.y, sliderTracker.w, sliderTracker.h);
					ctx.fillStyle = $scope.options.handleColor;
					ctx.fill();
					ctx.closePath();					
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
			}]
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
		var valProp = 'Site Incident Heat Severity Map (lv12)';

		function formatDataForDirective (data, labels, which) {
		    var def = $q.defer();
		    if (data && data.length) {
		        var result = {},
		        	expectedLength = labels.xAxis.length,
		            uniqueId = 0;
		        data.forEach(function (item, index) {
		            var value = item.data[valProp][0][which];
		            if (!result.hasOwnProperty(item.index.dowId)) {
		                result[item.index.dowId] = {rowLabel: labels.yAxis[item.index.dowId - 1], data: []};
		            }
		            result[item.index.dowId].data.push({
		                hour: item.index.hourId,
		                value: value,
		                xLabel: labels.xAxis[item.index.hourId]
		            });

		        });
		        for (var key in result) {
		            var cleanedData = [],
		                dataLen = result[key].data.length,
		                counter = 0;
		            result[key].data = result[key].data.sort(
		                function (a, b) {
		                    return a.hour - b.hour;
		                }
		            );
		            for (var i = 0; i < expectedLength; i++) {
		                if (counter < dataLen && i === result[key].data[counter].hour) {
		                    result[key].data[counter].id = uniqueId;
		                    cleanedData.push(result[key].data[counter]);
		                    uniqueId++;
		                    counter++;
		                } else {
		                    cleanedData.push({
		                        hour: i,
		                        value: 0,
		                        xLabel: labels.xAxis[i],
		                        colorIndex: 0,
		                        id: uniqueId
		                    });
		                    uniqueId++;
		                }
		            }
		            result[key].data = cleanedData;
		        }
		        def.resolve(result);
		    } else {
		        def.reject(false);
		    }
		    return def.promise;
		}

		function getHeatmapData (random, label, which) {
			var def = $q.defer();
			$http.get('http://localhost:3000/api/getheatmapdata/' + random)
				.success(function (data, status, headers, config) {
					if (!data.error && data.data && data.data.result) {
						def.resolve(formatDataForDirective(data.data.result, label, which));
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