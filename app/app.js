angular.module('heatMap', 
	[
		'ui.router',
		'ngMaterial'
	]
)
.config(function ($urlRouterProvider, $locationProvider, $mdThemingProvider) {
	$urlRouterProvider
        .otherwise('/');

    $locationProvider.html5Mode(true);

    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange')
        .warnPalette('red');

    $mdThemingProvider.enableBrowserColor({theme: 'default'});
})
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