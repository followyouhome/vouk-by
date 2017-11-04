var keystone = require('keystone');
var _ = require('underscore');

module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;
  var promotions = [];

  // Set locals
  locals.section = 'blog'
  locals.title = 'Воўчы блог';
  locals.data = {
    categories: [],
    posts: [],
    pages: [],
    wolves: [],
    promotion: {}
  };

  // Load all categories
  view.on('init', function(next) {

    var q = keystone.list('PostCategory')
              .model
              .find();

    q.exec(function(err, results) {
      results.forEach(function(category) {
        locals.data.categories[category.__ref] = category.id;
      });
      next(err);
    });

  });

  // Load post with pagination
  view.on('init', function(next) {

    var q = keystone.list('Post')
              .paginate({ 'page': req.query.page || 1, 'perPage': 5})
              .where('state', 'published')
              .where('categories', locals.data.categories['news'])
              .sort('-publishedDate');

    q.exec(function(err, results) {
      locals.data.posts = results.results; //OMG, results.results.results...
      locals.data.pages = results.pages;
      locals.data.currentPage = req.query && req.query.page || 1;
      next(err);
    });

  });

  // Load all wolves
  view.on('init', function (next) {

    var q = keystone.list('Wolf')
              .model
              .find()

    q.exec(function(err, results) {
      locals.data.wolves = results;
      next(err);
    });
  });

  // Load surveys
  view.on('init', function (next) {

    var q = keystone.list('Survey')
              .model
              .find()
              .where('state', 'published')
              .where(locals.section, true);

    q.exec(function(err, results) {
      promotions = promotions.concat(results);
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
      promotions = promotions.concat(results);
      next(err);
    });

  });

  // Select random promotion
  view.on('init', function (next) {

    if(promotions.length) {
      locals.data.promotion = _.sample(promotions);
      locals.data.promotion.type = locals.data.promotion.answers ? 'survey' : 'promo';
    } else {
      locals.data.class = 'no-promo';
    }

    next();
  });

  // Render the view
  view.render('blog');

};