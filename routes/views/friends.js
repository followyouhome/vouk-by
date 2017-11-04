var keystone = require('keystone');
var _ = require('underscore');

module.exports = function(req, res) {
  
  var view = new keystone.View(req, res);
  var locals = res.locals;
  var promotions = [];

  // Set locals
  locals.section = 'friends';
  locals.title = 'Нашы сябры';
  locals.data = {
    categories: [],
    newestPosts: [],
    friends: [],
    promotion: {}
  }

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

  // Load all friends
  view.on('init', function(next) {
    
    var q = keystone.list('Friend')
              .model
              .find();

    q.exec(function(err, results) {
      locals.data.friends = results;
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
  view.render('friends');
};
