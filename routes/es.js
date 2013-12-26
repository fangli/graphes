'use strict';
/*
 * GET es page.
 */

var db = require('./libs/db').cli;

exports.getindices = function(req, res){
  db.select(0, function(error){
      if(error) {
        res.send('Failed!');
      } else {
        db.set(req.body.name, JSON.stringify(req.body.profile), function(error){
          if(error) {
            res.send('Failed');
          } else {
            res.send('OK');
          }
        });
      }
    });
};
