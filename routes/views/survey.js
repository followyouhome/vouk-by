var keystone = require('keystone');

module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.section = 'survey';
  locals.title = '';
  locals.data = {
    lastSurveys: [],
    archivedSurveys: [],
    previousSurvey: {},
    currentSurvey: {},
    nextSurvey: {}
  };
  locals.filters = {
    key: req.params.survey,
    answer: req.query.answer
  };

  // Load current survey
  view.on('init', function(next) {

    var q = keystone.list('Survey')
              .model
              .findOne({
                'slug': locals.filters.key // to show both archived and published surveys (otherwise add 'state': 'published')
              });

    q.exec(function(err, results) {
      if(!results) 
        return res.status(404).send(keystone.wrapHTMLError('Sorry, no such survey was found'));

      if(locals.filters.answer) {
        var scores = results.scores.slice(0); //Can't directly modify queries results O_o

        if(!view.req.session[locals.filters.key]) { //Protect surveys from cheats
          scores[locals.filters.answer] = (parseInt(scores[locals.filters.answer]) + 1).toString(); //Need parseInt because can't use NumberArray here
          results.scores = scores;
          results.save();

          view.req.session[locals.filters.key] = true;

          locals.data.message = "Дзякуй за адказ!";
        } else {
          locals.data.message = "Вы ўжо прымалі ўдзел у нашым апытанні";
        }
      }

      locals.data.currentSurvey = results;
      var scoresSum = results.scores.reduce(function(a, b) {
        return parseInt(a) + parseInt(b);
      });
      locals.data.currentSurvey.scoresPercent = results.scores.map(function(a) {
        return Math.round(10000*(scoresSum ? parseInt(a)/scoresSum : 1/results.scores.length))/100; // precious of round - 2 nums after dot
      });
      locals.title = results.title;

      next(err);
    });

  });

  // Load previous survey
  view.on('init', function(next) {

    var q = keystone.list('Survey')
              .model
              .findOne({
                'state': ['published'],
                'publishedDate': { $lt: locals.data.currentSurvey.publishedDate }
              });

    q.exec(function(err, results) {
      locals.data.previousSurvey = results;
      next(err);
    });

  });

  // Load next survey
  view.on('init', function(next) {

    var q = keystone.list('Survey')
              .model
              .findOne({
                'state': 'published',
                'publishedDate': { $gt: locals.data.currentSurvey.publishedDate }
              });

    q.exec(function(err, results) {
      locals.data.nextSurvey = results;
      next(err);
    });

  });

  // Load last surveys
  view.on('init', function(next) {

    var q = keystone.list('Survey')
              .model
              .find()
              .where('state', 'published')
              .sort('-publishedDate')
              .limit('4');

    q.exec(function(err, results) {
      locals.data.lastSurveys = results;
      next(err);
    });

  });

  // Load archived surveys
  view.on('init', function(next) {

    var q = keystone.list('Survey')
              .model
              .find()
              .where('state', 'archived')
              .sort('publishedDate');

    q.exec(function(err, results) {
      locals.data.archivedSurveys = results;
      next(err);
    });

  });

  // Render the view
  view.render('survey');
};
