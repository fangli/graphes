'use strict';
/*
 * Controller for GraphES schemas
 */

var mSchemas = require('../models/schemasModel');

module.exports = function (app) {

  app.post('/api/schema/:id?', function (req, res) {
    mSchemas.saveSchema(req, res);
  });

  app.get('/api/schema', function (req, res) {
    mSchemas.list(req, res);
  });

  app.del('/api/schema/:id', function (req, res) {
    mSchemas.deleteSchema(req, res);
  });

  app.get('/api/schema/:id', function (req, res) {
    mSchemas.findByName(req, res);
  });

};
