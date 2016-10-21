'use strict()';

angular.module('heatMap').factory('WebService', ['$http', '$q',
	function ($http, $q) {
		function getHeatmapData () {
			var def = $q.defer();
			$http.get('http://localhost:3000/api/getheatmapdata')
				.success(function (data, status, headers, config) {
					if (!data.error && data.data && data.data.result) {
						def.resolve(data.data.result);
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