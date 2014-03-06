'use strict';

angular.module('graphEsApp')

  .controller('DashCtrl', function($scope, Head) {
    Head.setTitle('Dashboard');

    $scope.defaultChart = {options: {credits: {enabled: false, }, exporting: {enabled: false, }, }, title: {text: ''}, loading: true, };

    $scope.chart = {
             //This is not a highcharts object. It just looks a little like one!
             options: {
                plotOptions :{
                    line: {
                        marker: {
                          enabled: false
                        },
                    },
                },
                credits: {
                    enabled: false,
                },
                legend: false,
                exporting: {
                    enabled: false,
                },
                 //This is the Main Highcharts chart config. Any Highchart options are valid here.
                 //will be ovverriden by values specified below.
                 chart: {
                     type: 'line'
                 },
                 tooltip: {
                     style: {
                         fontWeight: 'bold'
                     }
                 },
             },

             //The below properties are watched separately for changes.

             //Series object - a list of series using normal highcharts series options.
             series: [{
                 data: [10, 15, 12, 8, 7, 23 ,13 ,15 ,16 ,17, 13, 15,10, 15, 12, 8, 7, 23 ,13 ,15 ,16 ,17, 13, 15 ]
             }],
             //Title configuration
             title: {
                 text: ''
             },
             //Boolean to control showng loading status on chart
             loading: false,
             //Configuration for the xAxis. Currently only one x axis can be dynamically controlled.
             //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
             yAxis: {
                title: null,
                gridLineWidth: 0,
             },
             xAxis: {
             },
             //Whether to use HighStocks instead of HighCharts. Defaults to false.
             useHighStocks: false
             }


    $scope.dashSettings = {
        'name': 'Default Dashboard',
        'description': 'the test dash',
        'created': 1370292929,
        'boxes': [
            {
                'name': 'Farm dash',
                'created': 1381928374,
                'description': 'the dash for farm',
                'groups': [
                    {
                        'name': 'tr',
                        'description': 'the tr platform for farm tr',
                        'chartHeight': '120px',
                        'chartWidth': '3',
                        'charts': [
                            {
                                'name': 'loadAvg',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'loadAvg',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'loadAvg',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'loadAvg',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'loadAvg',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'loadAvg',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'loadAvg',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'loadAvg',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'loadAvg',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                        ]
                    },
                    {
                        'name': 'ae',
                        'description': 'the ae platform for farm ae',
                        'chartHeight': '120px',
                        'chartWidth': '4',
                        'charts': [
                            {
                                'name': 'system load',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'system load',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'system load',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'system load',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'system load',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'system load',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'system load',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'system load',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                            {
                                'name': 'system load',
                                'chartData': null,
                                'chartQuery': {},
                                'style': {
                                    'type': 'area',
                                    'stacking': '',
                                }
                            },
                        ]
                    },
                ]
            },
        ]
    }

    $scope.loadGroupData = function (group) {
        angular.forEach(group.charts, function(chart, _id) {
            if (chart.chartData === null) {
                chart.chartData = $scope.defaultChart;
            } else {

            }
        });
    };

    $scope.activeTab = function(group) {
        window.dispatchEvent(new Event('resize'));
        $scope.loadGroupData(group);
    };
        

  }
);
