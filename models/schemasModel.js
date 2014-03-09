'use strict';

var db = require('./commonModel').db;
var ObjectID = require('./commonModel').ObjectID;

exports.findByName = function(req, res) {
  var id = req.params.id;
  if (!id) {
    res.status(500).send('No ID specificed');
    return;
  }
  db.collection('schemas', function(err, collection) {
    try {
      collection.findOne({'_id': new ObjectID.createFromHexString(id)}, function(err, item) {
          if (item) {
            res.send(JSON.parse(item.body));
          } else {
            res.status(404).send('Schema not found!');
          }
      });
    } catch(e) {
      res.status(500).send('Schema ID incorrect, unable to process your request!');
    }
  });
};

exports.list = function(req, res) {
  db.collection('schemas', function(err, collection) {

    collection.find().toArray(function(err, items) {
      if (items) {
        var schemas = [];
        for (var i = items.length - 1; i >= 0; i--) {
          var single = JSON.parse(items[i].body);
          single._id = items[i]._id;
          schemas.push(single);
        };
        res.send(schemas);
      } else {
        res.send('[]');
      }
    });
  });
};

exports.saveSchema = function(req, res) {
  var schema = req.body;
  var id = req.params.id;

  db.collection('schemas', function(err, collection) {
    if (id) {

      try {
        id = new ObjectID.createFromHexString(id);
      } catch(e) {
        res.status(500).send('Schema ID incorrect, unable to process your request!');
        return;
      }

      collection.update({'_id': id}, {body: JSON.stringify(schema)}, function(err, result) {
        if (err) {
          console.log('Error updating: ' + err);
          res.status(500).send('Unable to save schemas');
        } else {
          res.send({'_id': req.params.id});
        }
      });
    } else {
      collection.insert({body: JSON.stringify(schema)}, function(err, result) {
        if (err) {
          console.log('Error updating: ' + err);
          res.status(500).send('Unable to insert schemas');
        } else {
          res.send({'_id': result[0]['_id']});
        }
      });
    }
  });
    
};
 
exports.deleteSchema = function(req, res) {
  var id = req.params.id;
  if (!id) {
    res.status(500).send('No schema ID specificed');
  } else {

    var id;
    try {
      id = new ObjectID.createFromHexString(id);
    } catch(e) {
      res.status(500).send('ERROR: Invalid Schema ID!');
    }

    db.collection('schemas', function(err, collection) {
      collection.remove({'_id': id}, function(err, result) {
        if (err) {
          res.status(500).send('Unable to delete schema');
        } else {
          res.send({'status': result});
        }
      });
    });
  }
};
