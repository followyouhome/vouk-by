var keystone = require('keystone');

module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // Set locals
  locals.data = {
    searchResults: [],
    pagination: {}
  }

  // Set title
  locals.title =  'Пошук';

  if (req.query.q) {
    locals.title += ' | ' + req.query.q.charAt(0).toUpperCase() + req.query.q.slice(1); //I think with capitalize title will be more appropriate

    // Set post filters
    locals.filters = {
      term: new RegExp(req.query.q, 'i')
    }

    // Load newest post
    view.on('init', function(next) {

      var q = keystone.list('Post')
                .paginate({ 'page': req.query.page || 1, 'perPage': 10})
                .where('state', 'published')
                .or([
                  { 'title': locals.filters.term },
                  { 'content.brief': locals.filters.term },
                  { 'content.extended': locals.filters.term }
                ])
                .sort('-publishedDate')

      q.exec(function(err, results) {
        locals.data.searchResults = results.results;
        locals.data.pagination = {
          pages: results.pages,
          current: req.query && req.query.page || 1,
          previous: results.previous,
          next: results.next
        };
        next(err);
      });

    });
  }

  // Render the view
  view.render('search');
};
