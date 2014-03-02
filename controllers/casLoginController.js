'use strict';
/*
 * Controller for GraphES archives
 */

var config = require('../config');

module.exports = function (app) {

  app.get('/auth/cas/login', function (req, res) {
    var cas_server_url = config.cas_url.replace(/\s+$/,'');
    var service_url  = req.protocol + "://" + req.get('host') + req.url;

    var CAS = require('cas');
    var cas = new CAS({base_url: cas_server_url, service: service_url});

    var cas_login_url = cas_server_url + "/login?service=" + service_url;

    var ticket = req.param('ticket');
    if (ticket) {
      cas.validate(ticket, function(err, status, username) {
        if (err || !status) {
          // Handle the error
          res.send(
            'You may have logged in with invalid CAS ticket or permission denied.<br>' +
              '<a href="' + cas_login_url + '">Try again</a>'
          );
        } else {
          // Log the user in
          req.session.cas_user_name = username;
          res.redirect(req.session.login_redirect || '/');
        }
      });
    } else {
      if (!req.session.cas_user_name) {
        res.redirect(cas_login_url);
      } else {
        res.redirect(req.session.login_redirect || '/');
      }
    }
  });

};
