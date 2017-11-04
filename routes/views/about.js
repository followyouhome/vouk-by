var keystone = require('keystone');
var _ = require('underscore');

module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;
  var promotions = [];

  // Set locals
  locals.section = 'about';
  locals.title = 'Аб праекце';
  locals.data = {
    participants: [],
    categories: [],
    wolves: [],
    roles: [],
    promotion: {},
    post: {}
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

  // Load all participants roles for filter
  view.on('init', function(next) {

    var q = keystone.list('ParticipantRole')
              .model
              .find();

    q.exec(function(err, results) {
      locals.data.roles = results;
      next(err);
    });

  });

  // Load all participants
  view.on('init', function(next) {
    
    var q = keystone.list('Participant')
              .model
              .find()
              .populate('roles');

    q.exec(function(err, results) {
      locals.data.participants = results;
      locals.data.participants.forEach(function(participant) { //Parse roles to string
        participant.rolesString = participant.roles.map(function(role) {
          return role.__ref;
        }).join(' ');
      });
      next(err);
    });
  
  });

  // Load newest post  
  view.on('init', function(next) {

    var q = keystone.list('Post')
              .model
              .findOne()
              .where('state', 'published')
              .where('categories', locals.data.categories['news'])
              .sort('-publishedDate')
              .limit('1');

    q.exec(function(err, results) {
      locals.data.post = results;
      next(err);
    });

  });

  // Load all wolves
  view.on('init', function(next) {
    
    var q = keystone.list('Wolf')
              .model
              .find();

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
  view.render('about');
};
