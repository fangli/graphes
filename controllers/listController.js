'use strict';
/*
 * Controller for GraphES lists
 */

var mList = require('../models/listsModel');

module.exports = function (app) {

  app.post('/api/list', function (req, res) {
    mList.saveList(req, res);
  });

  app.post('/api/list/:name', function (req, res) {
    mList.saveList(req, res);
  });

  app.del('/api/list', function (req, res) {
    mList.deleteList(req, res);
  });

  app.del('/api/list/:name', function (req, res) {
    mList.deleteList(req, res);
  });

  app.get('/api/list', function (req, res) {
    mList.findAll(req, res);
  });

  app.get('/api/list/:name', function (req, res) {
    mList.findByName(req, res);
  });

};
