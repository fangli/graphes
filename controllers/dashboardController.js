'use strict';
/*
 * Controller for GraphES dashboards
 */

var mDashboards = require('../models/dashboardsModel');

module.exports = function (app) {

  app.post('/api/dashboard/:id?', function (req, res) {
    mDashboards.saveDashboard(req, res);
  });

  app.get('/api/dashboard', function (req, res) {
    mDashboards.list(req, res);
  });

  app.del('/api/dashboard/:id', function (req, res) {
    mDashboards.deleteDashboard(req, res);
  });


  app.get('/api/dashboard/:id', function (req, res) {
    mDashboards.findByName(req, res);
  });

};
