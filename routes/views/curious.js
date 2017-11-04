var keystone = require('keystone');

module.exports = function(req, res) {
  
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.section = 'curious';
  locals.title = 'Цікавасці';
  locals.data = {
    categories: [],
    newestPosts: [],
    curiousesPosts: [],
    curiousesPages: []
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

  // Load newest post
  view.on('init', function(next) {

    var q = keystone.list('Post')
              .model
              .find()
              .where('state', 'published')
              .where('categories', locals.data.categories['curious'])
              .sort('-publishedDate')
              .limit('2');

    q.exec(function(err, results) {
      locals.data.newestPosts = results;
      next(err);
    });

  });

  // Load curiouses with pagination
  view.on('init', function(next) {

    var q = keystone.list('Post')
              .paginate({ 'page': req.query.page || 1, 'perPage': 5})
              .where('state', 'published')
              .where('categories', locals.data.categories['curious'])
              .sort('-publishedDate')

    q.exec(function(err, results) {
      locals.data.curiousesPosts = results.results; //OMG, results.results.results...
      locals.data.curiousesPages = results.pages;
      locals.data.currentPage = req.query && req.query.page || 1;
      next(err);
    });

  });

  // Render the view
  view.render('curious');
};
