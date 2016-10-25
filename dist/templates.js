angular.module('heatMap').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/directives/rawHeatmapTemplate.html',
    "<div class=hm-container><md-slider-container>Severity &nbsp;<md-slider ng-model=severity min=0 max=9 md-discrete></md-slider></md-slider-container><div ng-repeat=\"(key, value) in hmDataSource\" class=hm-row><div class=row-label>{{value.rowLabel}}</div><div class=hm-square data-value={{index.value}} data-associated={{index.colorIndex}} ng-repeat=\"index in value.data\" ng-style=\"{'background-color': index.color}\" ng-class=\"{'gray-square': severity > index.colorIndex}\" ng-mouseover=\"showPopover($event, index)\" ng-mouseleave=hidePopover()><div ng-show=\"showWhich === index.id\" class=hm-popup ng-style=style>value: {{index.value}}</div></div></div><div class=hm-footer-spacer ng-style=\"{'width': xLabelWidth}\"></div><div class=hm-footer ng-repeat=\"label in axisLabels.xAxis track by $index\" ng-style=\"$index % 4 !== 0 && skip && {'opacity': 0}\">{{label}}</div></div>"
  );


  $templateCache.put('app/views/mainView.html',
    "<div layout-padding class=demo-container flex><div layout=row layout-align=\"center center\"><h1>Joey's HeatMap Widget</h1></div><div layout=row layout-align=\"center center\"><span style=\"max-width: 1000px\">This heatmap widget was created as a directive. The means the directive can be used in any app with minimal changes. Simply pass the directive your axis labels object and data object and the rest is taken care of.</span></div><div layout=row layout-align=\"center center\"><div layout=column layout-align=\"center center\"><p>This widget was made using the provided data.</p><raw-heatmap axis-labels=vm.axisLabels value-prop=vm.valProp hm-data=vm.hmData></raw-heatmap></div></div><div layout=row layout-align=\"center center\"><div layout=column layout-align=\"center center\"><p>This widget was made with randomized data using a high multiplier to create hotter results.</p><raw-heatmap axis-labels=vm.axisLabelsOther value-prop=vm.valProp hm-data=vm.hmDataOther></raw-heatmap></div></div><div layout=row layout-align=\"center center\"><div layout=column layout-align=\"center center\"><p>This is a canvas implementation.</p><canvas canvas-heatmap axis-labels=vm.axisLabels value-prop=vm.valProp hm-data=vm.hmData width=850 height=255 class=canvas-hm></canvas></div></div></div>"
  );

}]);
