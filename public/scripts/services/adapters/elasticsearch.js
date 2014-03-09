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

    var addComparisonSeries = function(chart, period) {
      if (period.compare === true) {
        var sNames = [];
        for(var k in chart.facets) { sNames.push(k); }
        for (var j in sNames) {
          chart.facets['Compare:' + sNames[j]] = angular.copy(chart.facets[sNames[j]]);
          var filterSlice = chart.facets['Compare:' + sNames[j]].facet_filter.fquery.query.filtered.filter.bool.must[0].range[period.timeField];
            filterSlice.from = DateConv.strtotime(period.start).getTime() + (period.offset * 1000);
            filterSlice.to = DateConv.strtotime(period.end).getTime() + (period.offset * 1000);
        }
      }
      return chart;
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
              singleSeries.data.push([data.facets[seriesName].entries[i].time - offset * 1000, data.facets[seriesName].entries[i].mean, data.facets[seriesName].entries[i].max]);
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
              singleSeries.data.push([data.facets[seriesName].entries[i].time - offset * 1000, data.facets[seriesName].entries[i][seriesType]]);
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

    var getIndices = function(period, pattern) {
      var oriStart = DateConv.strtotime(period.start).getTime();
      var oriEnd = DateConv.strtotime(period.end).getTime();
      var oriOffset = period.offset * 1000;
      var indices = resolveIndices(oriStart, oriEnd, 'days', pattern);
      if (period.compare) {
        var indicesWithOffset = resolveIndices(oriStart + oriOffset, oriEnd + oriOffset, 'days', pattern);
        for (var n = indicesWithOffset.length - 1; n >= 0; n--) {
          if (indices.indexOf(indicesWithOffset[n]) === -1) {
            indices.push(indicesWithOffset[n]);
          }
        }
      }
      indices = indices.join(',');
      return indices;
    };

    var getPointInterval = function(period) {
      if (period.pointIntervalOpt === 'interval') {
        return period.pointInterval;
      } else {
        var interv = Math.round(((DateConv.strtotime(period.end).getTime() - DateConv.strtotime(period.start).getTime()) / 1000) / period.pointPoints);
        if (interv === 0) {
          return '1s';
        } else {
          return interv.toString() + 's';
        }
      }
    };

    return {

      injectTimetoBasicQueries: function(oriQueries) {
        var isArray = true;
        if (Object.isObject(oriQueries)) {
          isArray = false;
          oriQueries = [oriQueries];
        }
        oriQueries.forEach(function(query){
          for(var i in query.chart.facets) {
            query.chart.facets[i].date_histogram.interval = getPointInterval(query.period);
            query.chart.facets[i].facet_filter.fquery.query.filtered.filter.bool.must[0].range[query.period.timeField] = {
                'from': DateConv.strtotime(query.period.start).getTime(),
                'to': DateConv.strtotime(query.period.end).getTime(),
              };
          }
          query.indices = getIndices(query.period, query.pattern);
          query.chart = addComparisonSeries(query.chart, query.period);
        });
        if (isArray) {
          return oriQueries;
        } else {
          return oriQueries[0];
        }
      },

      getBasicQueries: function(settings) {
        var filterGroup = [];
        var assembledSingle = [];

        // Split all dimensions from the raw object
        for (var k = settings.def.model.dimensions.length - 1; k >= 0; k--) {
          var dimension = settings.def.model.dimensions[k];
          if (dimension.enabled) {
            var single = [];
            for (var name in dimension.lists) {
              if (dimension.lists[name] === true) {
                single.push(getRealQuery(dimension.pattern, name));
              }
            }
            if (!dimension.enableGroup) {
              filterGroup = multiplePush(filterGroup, single);
            } else {
              assembledSingle = angular.copy(single);
            }
          }
        }

        filterGroup = assemblePush(filterGroup, assembledSingle);

        // Prepare series template
        var seriesTemplate = angular.copy(esSeriesStr);
        seriesTemplate.date_histogram.key_field = settings.def.period.timeField;
        if (settings.def.visualization.valueField.indexOf('doc[') === -1){
          seriesTemplate.date_histogram.value_field = settings.def.visualization.valueField;
        } else {
          seriesTemplate.date_histogram.value_script = settings.def.visualization.valueField;
        }

        seriesTemplate.facet_filter.fquery.query.filtered.query.query_string.query = settings.def.model.query;
        // End prepare query template

        // Combine all series
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

        if (charts.length === 0) {
          var theChart = angular.copy(esQueryStr);
          theChart.facets.Main = angular.copy(seriesTemplate);
          charts.push(theChart);
        }


        // Get chart type
        var type = (settings.def.visualization.type === 'range')? 'range': settings.def.visualization.chartValue;

        var ret = [];
        for (var k = charts.length - 1; k >= 0; k--) {
          ret.push({
            chart: charts[k],
            seriesType: type,
            period: settings.def.period,
            pattern: settings.pattern,
            mainQuery: settings.def.model.query,
            graphType: settings.def.visualization.type,
            stacking: settings.def.visualization.stacking,
          });
        }
        return ret;
      },

      getOne: function(query, cb, param) {
        var pro = makeRequest(query.indices, query.chart);
        pro.then(function(data) {
          cb(postParse(data,query.seriesType, query.period.offset), param);
        }, function(e) {
          window.alert(e.error);
        });
      },

    };

  }]);
