'use strict';

var moment = require('moment');
var rest = require('restler');
var cfg = require('../config');

exports.facets = function(req, res) {

  var deepClone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
  };

  var strtotime = function(str) {
    require('sugar');
    if (+str == str) {
      return Date.create(+str);
    } else {
      return Date.create(str);
    }
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

  if (req.body) {
    req.query = req.body;
  }

  var index_pattern = req.query.index_pattern;
  var time_field = req.query.time_field;
  var value_field = req.query.value_field;
  var interval = req.query.interval;
  var from = strtotime(req.query.from).getTime();
  var to = strtotime(req.query.to).getTime();
  var series = req.query.series;

  if (!(index_pattern && time_field && value_field && interval && from && to && series)) {
    res.status(400).send('Incomplete parameters');
  }

  var indices = resolveIndices(from, to, 'days', index_pattern);

  var esQuery =
  {
    facets: {},
    size: 0
  };

  var range = {};
  range['range'] = {};
  range['range'][time_field] = {from: from, to: to};

  var esSeriesTpl =
  {
    date_histogram: {
      interval: interval,
      key_field: time_field,
      value_field: value_field,
    },
    global: true,
    facet_filter: {
      fquery: {
        query: {
          filtered: {
            query: {
              match_all: {},
            },
            filter: {
              bool: {
                must: [
                  range,
                ]
              }
            }
          }
        }
      }
    }
  };

  for (var seriesName in series) {
    var aSeries = deepClone(esSeriesTpl);
    for (var i in series[seriesName]) {
      aSeries.facet_filter.fquery.query.filtered.filter.bool.must.push(
        {
          'fquery': {
            'query': {
              'query_string': {
                'query': series[seriesName][i],
              }
            },
            '_cache': true
          }
        }
      );
    }
    esQuery.facets[seriesName] = aSeries;
  }

  rest.post(
    [
      'http://',
      cfg.es_host,
      ':',
      cfg.es_port,
      '/',
      indices.join(','),
      '/_search'
    ].join(''),
    {
      username: cfg.es_user,
      password: cfg.es_passwd,
      data: JSON.stringify(esQuery),
    }
  )
  .on('success', function(data){
      res.send(data);
    })
  .on('4XX', function(err) {
    res.status(400).send(err);
  })
  .on('5XX', function(err) {
    res.status(500).send('Unable to process your request due to ES 500 error: ' + err);
  })
  .on('timeout', function(data) {
    res.status(500).send('Backend ElasticSearch Server Timeout');
  })
  .on('error', function(err) {
    res.status(500).send('We are experiencing internal problems, service unavailable: ' + err);
  });

};
