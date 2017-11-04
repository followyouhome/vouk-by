var keystone = require('keystone');

module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.data = {
    categories: [],
    newestPosts: [],
    curiousPosts: []
  };
  locals.section = 'homepage';

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

  // Load newest posts  
  view.on('init', function(next) {

    var q = keystone.list('Post')
              .model
              .find()
              .where('state', 'published')
              .where('categories', locals.data.categories['news'])
              .sort('-publishedDate')
              .limit('3');

    q.exec(function(err, results) {
      locals.data.newestPosts = results;
      next(err);
    });

  });

  // Load curious
  view.on('init', function(next) {

    var q = keystone.list('Post')
              .model
              .find()
              .where('state', 'published')
              .where('categories', locals.data.categories['curious'])
              .sort('-publishedDate')
              .limit('2')
              .sort('publishedDate');
              
    q.exec(function(err, results) {
      locals.data.curiousPosts = results;
      next(err);
    });

  });

  // Render the view
  view.render('homepage');
};
