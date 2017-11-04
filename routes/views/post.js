var keystone = require('keystone');

module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.section = 'post';
  locals.title = '';
  locals.data = {
    categories: [],
    newestPosts: [],
    previousPost: {},
    currentPost: {},
    nextPost: {}
  };
  locals.filters = {
    key: req.params.post
  }

  // Load current post
  view.on('init', function(next) {

    var q = keystone.list('Post')
              .model
              .findOne({
                'state': 'published',
                'slug': locals.filters.key
              })
              .populate('author');

    q.exec(function(err, results) {
      if(!results)
        return res.status(404).send(keystone.wrapHTMLError('Sorry, no such post was found'));

      locals.data.currentPost = results;
      locals.title = results.title;
      next(err);
    });

  });

  // Load previous post
  view.on('init', function(next) {

    var q = keystone.list('Post')
              .model
              .findOne({
                'state': 'published',
                'publishedDate': { $lt: locals.data.currentPost.publishedDate }
              });

    q.exec(function(err, results) {
      locals.data.previousPost = results;
      next(err);
    });

  });

  // Load next post
  view.on('init', function(next) {

    var q = keystone.list('Post')
              .model
              .findOne({
                'state': 'published',
                'publishedDate': { $gt: locals.data.currentPost.publishedDate }
              });

    q.exec(function(err, results) {
      locals.data.nextPost = results;
      next(err);
    });

  });

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
              .where('categories', locals.data.categories['news'])
              .sort('-publishedDate')
              .limit('2');

    q.exec(function(err, results) {
      locals.data.newestPosts = results;
      next(err);
    });

  });

  // Render the view
  view.render('post');
};
