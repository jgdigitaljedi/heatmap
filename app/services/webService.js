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
					console.log('ws', data);
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