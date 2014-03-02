'use strict';
/*
 * Controller for GraphES archives
 */

var mArchives = require('../models/archivesModel');

module.exports = function (app) {

  app.post('/api/archive', function (req, res) {
    mArchives.saveArchive(req, res);
  });

  app.del('/api/archive/:name', function (req, res) {
    mArchives.deleteArchive(req, res);
  });


  app.get('/api/archive/:name', function (req, res) {
    mArchives.findByName(req, res);
  });

};
