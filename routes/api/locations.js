var keystone = require('keystone');
var Post = keystone.list('Post');
var Wolf = keystone.list('Wolf');

exports = module.exports = function(req, res) {

  var wolves = {};
  var data = [];

  Wolf.model
    .find()
    .exec()
    .then(function(query) {

      query.forEach(function(wolf) {

        var habitat = wolf.territoryCoordinates.map(function(latlng) {
          return latlng.split(/\s+/g)
        })

        data.push(wolves[wolf.name] = {
          name: wolf.name,
          avatar: wolf.avatar.src,
          color: wolf.mapColor,
          habitat: habitat,
          locations: []
        });
      });

      return Post.model
        .find({ location: { $exists: true } })
        .sort('publishedDate')
        .populate('wolf', 'name')
        .exec()
    })
    .then(function(query) {

      query.forEach(function(post) {

        wolves[post.wolf.name].locations.push({
          title: post.title,
          date: new Date(post.publishedDate),
          url: post.href,
          latlng: post.location,
          marker: post.state !== 'marker'
        });
      });

      res.apiResponse(data);
    })
}
