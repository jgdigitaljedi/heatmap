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
});