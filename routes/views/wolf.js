var keystone = require('keystone');
var _ = require('underscore');

module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;
  var promotions = [];

  // Set locals
  locals.section = 'wolf'
  locals.title = '';
  locals.data = {
    wolf: {},
    promotion: {},
    pages: [],
    posts: [],
  };
  locals.filters = {
    wolf: req.params.wolf
  }

  // Load all wolves
  view.on('init', function (next) {

    var q = keystone.list('Wolf')
              .model
              .findOne()
              .where('slug', locals.filters.wolf);

    q.exec(function(err, results) {
      if(!results) 
        return res.status(404).send(keystone.wrapHTMLError('Sorry, no such wolf was found'));
      locals.data.wolf = results;
      locals.title = results.name;
      next(err);
    });
  });

  // Load post with pagination
  view.on('init', function(next) {

    var q = keystone.list('Post')
              .paginate({ 'page': req.query.page || 1, 'perPage': 2}) //TODO: change perPage to 6
              .where('state', 'published')
              .where('wolves.', locals.data.wolf._id);

    q.exec(function(err, results) {
      locals.data.posts = results.results;
      locals.data.pages = results.pages;
      locals.data.currentPage = req.query && req.query.page || 1;
      next(err);
    });

  });

  // Load promos
  view.on('init', function (next) {

    var q = keystone.list('Promo')
              .model
              .find()
              .where('state', 'published')
              .where(locals.section, true);

    q.exec(function(err, results) {

      if(results.length) {
        locals.data.promotion = _.sample(results);
        locals.data.promotion.type = 'promo';      
      } else {
        locals.data.class = 'no-promo';
      }

      next(err);
    });

  });

  // Render the view
  view.render('wolf');

};
