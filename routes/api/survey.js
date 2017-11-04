var keystone = require('keystone');
var Survey = keystone.list('Survey');

exports = module.exports = function(req, res) {
  var id = req.params.id;
  var answer = req.query.answer;

  if(!req.params.id) {
    res.apiResponse({ error: 'survey\'s id is missed' });
  }
  
  Survey.model.findOne().where({ _id: id }).exec(function(err, results) {
    var scores = results.scores.slice(0); //Can't directly modify queries result
    
    scores[answer] = (parseInt(scores[answer]) + 1).toString(); //Need parseInt because can't use NumberArray here
    results.scores = scores;
    results.save();
    
    //Use JSON response
    //res.apiResponse({ message: { id: id, score: results.scores }});
    
    //Or mb redirect is enough
    backURL=req.header('Referer') || '/';
    res.redirect(backURL);
  });
}