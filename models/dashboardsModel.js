'use strict';

var db = require('./commonModel').db;
var ObjectID = require('./commonModel').ObjectID;

exports.findByName = function(req, res) {
  var id = req.params.id;
  if (!id) {
    res.status(500).send('No ID specificed');
    return;
  }
  db.collection('dashboards', function(err, collection) {
    try {
      collection.findOne({'_id': new ObjectID.createFromHexString(id)}, function(err, item) {
          if (item) {
            res.send(JSON.parse(item.body));
          } else {
            res.status(404).send('Dashboard not found!');
          }
      });
    } catch(e) {
      res.status(500).send('Dashboard ID incorrect, unable to process your request!');
    }
  });
};

exports.list = function(req, res) {
  db.collection('dashboards', function(err, collection) {

    collection.find().toArray(function(err, items) {
      if (items) {
        var dashboards = [];
        for (var i = items.length - 1; i >= 0; i--) {
          var single = JSON.parse(items[i].body);
          var name = single.name;
          var description = single.description;
          var global = single.global;
          dashboards.push({'_id': items[i]._id, name: name, description: description, 'global': global});
        };
        res.send(dashboards);
      } else {
        res.send('[]');
      }
    });
  });
};

exports.saveDashboard = function(req, res) {
  var dashboard = req.body;
  var id = req.params.id;

  db.collection('dashboards', function(err, collection) {
    if (id) {

      try {
        id = new ObjectID.createFromHexString(id);
      } catch(e) {
        res.status(500).send('Dashboard ID incorrect, unable to process your request!');
        return;
      }

      collection.update({'_id': id}, {body: JSON.stringify(dashboard)}, function(err, result) {
        if (err) {
          console.log('Error updating: ' + err);
          res.status(500).send('Unable to save dashboards');
        } else {
          res.send({'_id': req.params.id});
        }
      });
    } else {
      collection.insert({body: JSON.stringify(dashboard)}, function(err, result) {
        if (err) {
          console.log('Error updating: ' + err);
          res.status(500).send('Unable to insert dashboards');
        } else {
          res.send({'_id': result[0]['_id']});
        }
      });
    }
  });
    
};
 
exports.deleteDashboard = function(req, res) {
  var id = req.params.id;
  if (!id) {
    res.status(500).send('No dashboard ID specificed');
  } else {

    var id;
    try {
      id = new ObjectID.createFromHexString(id);
    } catch(e) {
      res.status(500).send('ERROR: Invalid Dashboard ID!');
    }

    db.collection('dashboards', function(err, collection) {
      collection.remove({'_id': id}, function(err, result) {
        if (err) {
          res.status(500).send('Unable to delete dashboard');
        } else {
          res.send({'status': result});
        }
      });
    });
  }
};
