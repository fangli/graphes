'use strict';

angular.module('graphEsApp')

  .factory('Graph', ['Es', function(Es) {

    var adapter = Es;

    return {

      injectTimetoBasicQueries: function(basicQueries) {
        return adapter.injectTimetoBasicQueries(basicQueries);
      },

      getBasicQueries: function(settings) {
        return adapter.getBasicQueries(settings);
      },

      getOne: function(query, cb, params) {
        return adapter.getOne(query, cb, params);
      },

      // params
      // {
      //   "title": "The title of graph",
      //   "yaxisTitle": "The Y axis title",
      //   "series": [], // The series of data
      //   "graphType": "line" | "bar",
      //   "stacking": "normal" | "percent"
      // }
      parseGraphConfig: function(params, briefMode) {
        var graphTemplate;
        var pointFormat;
        var min;
        if (params.stacking != 'percent') {
          min = null;
          pointFormat = '<span style="color:{series.color}">{series.name}</span>: {point.y}<br/>';
        } else {
          min = 0;
          pointFormat = '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y})<br/>';
        }

        if (params.graphType === 'area')
        {
          graphTemplate = {
            title: {
              text: (briefMode)? '' : params.title,
            },
            options: {
              legend: {
                enabled: !briefMode,
              },
              exporting: {
                  enabled: !briefMode,
              },
              credits: {
                  enabled: false,
              },
              tooltip: {
                crosshairs: true,
                pointFormat: pointFormat,
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
                min: min,
                title: {
                  text: (briefMode)? '' : params.yaxisTitle,
                },
              },
              plotOptions: {
                area: {
                  stacking: params.stacking,
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
              text: (briefMode)? '' : params.title,
            },
            options: {
              legend: {
                enabled: !briefMode,
              },
              exporting: {
                  enabled: !briefMode,
              },
              credits: {
                  enabled: false,
              },
              tooltip: {
                pointFormat: pointFormat,
              },
              plotOptions: {
                column: {
                  stacking: params.stacking,
                },
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
                min: min,
                title: {
                  text: (briefMode)? '' : params.yaxisTitle,
                }
              },
            },
            series: params.series,
          };
        } else if (params.graphType === 'line') {
          graphTemplate = {
            title: {
              text: (briefMode)? '' : params.title,
            },
            options: {
              legend: {
                enabled: !briefMode,
              },
              exporting: {
                  enabled: !briefMode,
              },
              credits: {
                  enabled: false,
              },
              tooltip: {
                crosshairs: true,
                shared: true,
                pointFormat: pointFormat,
              },
              chart: {
                type: 'line',
                zoomType: 'x',
              },
              plotOptions: {
                lineWidth: 1,
                line: {
                  stacking: params.stacking,
                  marker: {
                    enabled: false
                  },
                },
              },
              xAxis: {
                type: 'datetime',
              },
              yAxis: {
                min: min,
                title: {
                  text: (briefMode)? '' : params.yaxisTitle,
                }
              },
            },
            series: params.series,
          };
        } else if (params.graphType === 'range') {
          graphTemplate = {
            title: {
              text: (briefMode)? '' : params.title,
            },
            options: {
              legend: {
                enabled: !briefMode,
              },
              exporting: {
                  enabled: !briefMode,
              },
              credits: {
                  enabled: false,
              },
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
                  text: (briefMode)? '' : params.yaxisTitle,
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
