/**
 * Configure CAS Authentication
 * When no cas_server_url presented, no CAS authentication applied.
 */


exports.configureCas = function(express, app, cas_server_url) {

  app.use(function(req, res, next) {
    if ((!cas_server_url) || req.url.indexOf('/auth/cas/login') === 0 || req.session.cas_user_name) {
      next();
    } else {
      req.session.login_redirect = req.url;
      res.redirect('/auth/cas/login');
    }
  });

};
