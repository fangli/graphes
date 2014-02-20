'use strict';

angular.module('graphEsApp')

  .factory('Graph', ['Es', function(Es) {

    var adapter = Es;

    return {

      preParse: function(settings, currentProfile) {
        return adapter.preParse(settings, currentProfile);
      },

      get: function(queries, cb) {
        return adapter.get(queries, cb);
      },

      // params
      // {
      //   "title": "The title of graph",
      //   "yaxisTitle": "The Y axis title",
      //   "series": [], // The series of data
      //   "graphType": "line" | "bar",
      // }
      parseGraphConfig: function(params) {
        var graphTemplate;
        if (params.graphType === 'area')
        {
          graphTemplate = {
            title: {
              text: params.title,
            },
            options: {
              tooltip: {
                crosshairs: true,
                shared: true,
              },
              chart: {
                type: 'area',
                zoomType: 'x',
              },
              xAxis: {
                type: 'datetime',
              },
              yAxis: {
                title: {
                  text: params.yaxisTitle,
                },
              },
              plotOptions: {
                area: {
                  fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                      [0, Highcharts.getOptions().colors[0]],
                      [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                  },
                  fillOpacity: 0.5,
                  lineWidth: 1,
                  marker: {
                    enabled: false
                  },
                  shadow: false,
                  states: {
                    hover: {
                      lineWidth: 1
                    }
                  },
                  threshold: null
                }
              },
            },
            series: params.series,
          };
        } else if (params.graphType === 'column') {
          graphTemplate = {
            title: {
              text: params.title,
            },
            options: {
              plotOptions: {
                lineWidth: 1,
              },
              chart: {
                type: 'column',
                zoomType: 'x',
              },
              xAxis: {
                type: 'datetime',
              },
              yAxis: {
                title: {
                  text: params.yaxisTitle,
                }
              },
            },
            series: params.series,
          };
        } else if (params.graphType === 'line') {
          graphTemplate = {
            title: {
              text: params.title,
            },
            options: {
              tooltip: {
                crosshairs: true,
                shared: true,
              },
              chart: {
                type: 'line',
                zoomType: 'x',
              },
              plotOptions: {
                lineWidth: 1,
                line: {
                  marker: {
                    enabled: false
                  },
                },
              },
              xAxis: {
                type: 'datetime',
              },
              yAxis: {
                title: {
                  text: params.yaxisTitle,
                }
              },
            },
            series: params.series,
          };
        } else if (params.graphType === 'range') {
          graphTemplate = {
            title: {
              text: params.title,
            },
            options: {
              tooltip: {
                crosshairs: true,
                shared: true,
              },
              chart: {
                type: 'arearange',
                zoomType: 'x',
              },
              xAxis: {
                type: 'datetime',
              },
              yAxis: {
                title: {
                  text: params.yaxisTitle,
                }
              },
            },
            series: params.series,
          };
        }

        return graphTemplate;

      },

    };
  }]);
