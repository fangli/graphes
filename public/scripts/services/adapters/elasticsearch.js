'use strict';

angular.module('graphEsApp')

  .factory('Es', ['$http', '$q', 'DateConv', function($http, $q, DateConv) {

    var esQueryStr =
    {
      facets: {},
      size: 0
    };

    var esSeriesStr =
    {
      'date_histogram': {},
      'global': true,
      'facet_filter': {
        'fquery': {
          'query': {
            'filtered': {
              'query': {
                'query_string': {
                  'query': '*',
                }
              },
              'filter': {
                'bool': {
                  'must': [
                    {
                      'range': {},
                    }
                  ]
                }
              }
            }
          }
        }
      }
    };

    var multiplePush = function(base, value) {
      var result = [];

      if (value.length === 0) {
        return base;
      }

      if (base.length === 0) {
        for (var v = value.length - 1; v >= 0; v--) {
          result.push([[value[v]]]);
        }
        return result;
      }

      for (var m = value.length - 1; m >= 0; m--) {
        for (var b = base.length - 1; b >= 0; b--) {
          var _tmp = angular.copy(base[b]);
          _tmp[0].push(value[m]);
          result.push(_tmp);
        }
      }
      return result;
    };

    var assemblePush = function(base, assemble) {
      var result = [];

      if (assemble.length === 0) {
        return base;
      }

      for (var i = base.length - 1; i >= 0; i--) {
        var singleChart = [];
        var originalSeries = base[i][0];
        for (var j = assemble.length - 1; j >= 0; j--) {
          var series = angular.copy(originalSeries);
          series.push(assemble[j]);
          singleChart.push(series);
        }
        result.push(singleChart);
      }
      return result;
    };

    var addComparisonSeries = function(charts, timeField, config) {
      if (config.compare === true) {

        for (var i = charts.length - 1; i >= 0; i--) {

          var sNames = [];
          for(var k in charts[i].facets) { sNames.push(k); }

          for (var j in sNames) {
            charts[i].facets['Compare:' + sNames[j]] = angular.copy(charts[i].facets[sNames[j]]);
            var filterSlice = charts[i].facets['Compare:' + sNames[j]].facet_filter.fquery.query.filtered.filter.bool.must[0].range[timeField];
              filterSlice.from = DateConv.strtotime(config.start).getTime() + (config.offset * 1000);
              filterSlice.to = DateConv.strtotime(config.end).getTime() + (config.offset * 1000);
          }
        }
      }
      return charts;
    };

    var getRealQuery = function(pattern, replacement) {
      return pattern.substring(0, pattern.indexOf('{')) + replacement + pattern.substring(pattern.lastIndexOf('}') + 1);
    };

    var makeRequest = function(index, query) {
      return $http({method: 'POST', url: '/__es/' + index + '/_search', data: query})
      .then(function(response) {
        if (typeof response.data === 'object') {
          return response.data;
        } else {
          // invalid response
          return $q.reject(response.data);
        }
      }, function(response) {
          // something went wrong
        return $q.reject(response.data);
      });
    };

    var postParse = function(data, seriesType, offset) {
      var seriesTemplate;
      if (seriesType === 'range') {
        seriesTemplate = {
          name: '',
          data: [],
          type: 'arearange',
          lineWidth: 1,
          fillOpacity: 0.5,
          zIndex: 0,
        };
      } else {
        seriesTemplate = {
          name: '',
          data: [],
        };
      }

      var seriesData = [];

      // For a better performance I put the seriesType outside foreach.
      if (seriesType === 'range') {
        for (var seriesName in data.facets) {
          var singleSeries = angular.copy(seriesTemplate);
          singleSeries.name = seriesName;
          for (var i = 0; i < data.facets[seriesName].entries.length; i++) {
            if (seriesName.substr(0, 8) === 'Compare:') {
              singleSeries.data.push([data.facets[seriesName].entries[i].time - offset, data.facets[seriesName].entries[i].mean, data.facets[seriesName].entries[i].max]);
            } else {
              singleSeries.data.push([data.facets[seriesName].entries[i].time, data.facets[seriesName].entries[i].mean, data.facets[seriesName].entries[i].max]);
            }
          }
          seriesData.push(singleSeries);
        }
      } else {
        for (var seriesName in data.facets) {
          var singleSeries = angular.copy(seriesTemplate);
          singleSeries.name = seriesName;
          for (var i = 0; i < data.facets[seriesName].entries.length; i++) {
            if (seriesName.substr(0, 8) === 'Compare:') {
              singleSeries.data.push([data.facets[seriesName].entries[i].time - offset, data.facets[seriesName].entries[i][seriesType]]);
            } else {
              singleSeries.data.push([data.facets[seriesName].entries[i].time, data.facets[seriesName].entries[i][seriesType]]);
            }
          }
          seriesData.push(singleSeries);
        }
      }
      
      return seriesData;
    };

    var resolveIndices = function(start, end, interval, pattern) {
      var indices = [];
      var cursor = moment(start);
      while (moment(cursor).isBefore(moment(end))) {
        var indice = cursor.utc().format(pattern);
        if (indices.indexOf(indice) === -1) {
          indices.push(indice);
        }
        cursor = cursor.add(interval, 1);
      }
      // Add the last indice
      if (indices.indexOf(moment(end).utc().format(pattern)) === -1) {
        indices.push(moment(end).utc().format(pattern));
      }
      return indices;
    };

    var getPointInterval = function(start, end, interval, points, option) {
      if (option === 'interval') {
        return interval;
      } else {
        var interv = Math.round(((end - start) / 1000) / points);
        if (interv === 0) {
          return '1s';
        } else {
          return interv.toString() + 's';
        }
      }
    };

    return {

      preParse: function(settings, profile) {
        var filterGroup = [];
        var assembledSingle = [];
        for (var k = settings.model.dimensions.length - 1; k >= 0; k--) {
          var single = [];
          for (var name in settings.model.dimensions[k].lists) {
            if (settings.model.dimensions[k].lists[name] === true) {
              single.push(getRealQuery(settings.model.dimensions[k].pattern, name));
            }
          }
          if (!settings.model.dimensions[k].enableGroup) {
            filterGroup = multiplePush(filterGroup, single);
          } else {
            assembledSingle = angular.copy(single);
          }
        }

        filterGroup = assemblePush(filterGroup, assembledSingle);

        // Prepare series template
        var seriesTemplate = angular.copy(esSeriesStr);
        seriesTemplate.date_histogram.key_field = settings.visualization.timeField;
        if (settings.visualization.valueField.indexOf('doc[') === -1){
          seriesTemplate.date_histogram.value_field = settings.visualization.valueField;
        } else {
          seriesTemplate.date_histogram.value_script = settings.visualization.valueField;
        }
        seriesTemplate.date_histogram.interval = getPointInterval(
          DateConv.strtotime(settings.period.start).getTime(),
          DateConv.strtotime(settings.period.end).getTime(),
          settings.visualization.pointInterval,
          settings.visualization.pointPoints,
          settings.visualization.pointIntervalOpt
        );
        seriesTemplate.facet_filter.fquery.query.filtered.query.query_string.query = settings.model.query;
        seriesTemplate.facet_filter.fquery.query.filtered.filter.bool.must[0].range[settings.visualization.timeField] = {
          'from': DateConv.strtotime(settings.period.start).getTime(),
          'to': DateConv.strtotime(settings.period.end).getTime(),
        };
        // End prepare query template

        var charts = [];
        // For each chart
        for (var i = filterGroup.length - 1; i >= 0; i--) {
          var singleChart = angular.copy(esQueryStr);
          // For each series
          for (var j = filterGroup[i].length - 1; j >= 0; j--) {
            var singleSeries = angular.copy(seriesTemplate);
            var singleSeriesName = [];
            // For each filter
            for (var m = filterGroup[i][j].length - 1; m >= 0; m--) {
              singleSeries.facet_filter.fquery.query.filtered.filter.bool.must.push(
              {
                'fquery': {
                  'query': {
                    'query_string': {
                      'query': filterGroup[i][j][m],
                    }
                  },
                  '_cache': true
                }
              });
              singleSeriesName.push(filterGroup[i][j][m]);
            } // End filter
            singleChart.facets[singleSeriesName.join(',')] = singleSeries;
          } // End series
          charts.push(singleChart);
        } // End chart

        charts = addComparisonSeries(charts, settings.visualization.timeField, settings.period);

        if (charts.length === 0) {
          var theChart = angular.copy(esQueryStr);
          theChart.facets.Main = angular.copy(seriesTemplate);
          charts.push(theChart);
        }

        var oriStart = DateConv.strtotime(settings.period.start).getTime();
        var oriEnd = DateConv.strtotime(settings.period.end).getTime();
        var oriOffset = settings.period.offset * 1000;

        var indices = resolveIndices(oriStart, oriEnd, 'days', profile.pattern);

        if (settings.period.compare) {
          var indicesWithOffset = resolveIndices(oriStart + oriOffset, oriEnd + oriOffset, 'days', profile.pattern);
          for (var n = indicesWithOffset.length - 1; n >= 0; n--) {
            if (indices.indexOf(indicesWithOffset[n]) === -1) {
              indices.push(indicesWithOffset[n]);
            }
          }
        }

        indices = indices.join(',');

        var type = (settings.visualization.type === 'range')? 'range': settings.visualization.chartValue;
        return {indices: indices, charts: charts, seriesType: type};
      },

      get: function(queries, settings, cb) {
        var pro = [];
        for (var i = queries.charts.length - 1; i >= 0; i--) {
          (function(a) {
            pro[a] = makeRequest(queries.indices, queries.charts[a]);
            pro[a].then(
              function(data) {
                cb(postParse(data, queries.seriesType, settings.period.offset * 1000));
              },
              function() {
                window.alert('Error occured when retrieving data!');
              }
            );
          })(i);
        }
      },

    };

  }]);
