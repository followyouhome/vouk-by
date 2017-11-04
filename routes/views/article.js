var keystone = require('keystone');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;
  locals.data = {};

  //locals.section = 'home';

  // Render the view
  view.render('article');

};
