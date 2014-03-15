'use strict';
/*
 * GraphES data service
 */

var m = require('../models/esdataModel');

module.exports = function (app) {

  app.get('/api/es/facets', function (req, res) {
    m.facets(req, res);
  });

  app.post('/api/es/facets', function (req, res) {
    m.facets(req, res);
  });

};
