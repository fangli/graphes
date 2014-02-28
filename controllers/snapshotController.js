'use strict';
/*
 * Controller for GraphES snapshots
 */

var mSnapshots = require('../models/snapshotsModel');

module.exports = function (app) {

  app.post('/api/snapshot', function (req, res) {
    mSnapshots.saveSnapshot(req, res);
  });

  app.del('/api/snapshot/:name', function (req, res) {
    mSnapshots.deleteSnapshot(req, res);
  });


  app.get('/api/snapshot/:name', function (req, res) {
    mSnapshots.findByName(req, res);
  });

};
