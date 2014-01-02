'use strict';
/*
 * Controller for GraphES profiles
 */

var mProfiles = require('../models/profilesModel');

module.exports = function (app) {

  app.post('/api/profile', function (req, res) {
    mProfiles.saveProfile(req, res);
  });

  app.post('/api/profile/:name', function (req, res) {
    mProfiles.saveProfile(req, res);
  });

  app.del('/api/profile', function (req, res) {
    mProfiles.deleteProfile(req, res);
  });

  app.del('/api/profile/:name', function (req, res) {
    mProfiles.deleteProfile(req, res);
  });

  app.get('/api/profile', function (req, res) {
    mProfiles.findAll(req, res);
  });

  app.get('/api/profile/:name', function (req, res) {
    mProfiles.findByName(req, res);
  });

};
