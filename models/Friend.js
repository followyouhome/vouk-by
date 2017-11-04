var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Friend Model
 * ==========
 */

var Friend = new keystone.List('Friend', {
  autokey: { path: 'slug', from: 'title', unique: true },
  map: { name: 'title' },
});

Friend.add({
  title: { type: String, required: true },
  link: { type: String },
  description: {type: String },
  image: { type: Types.LocalFile, dest: 'public/images/friends', prefix: '/images/friends' }
});

//Fix url for images located in public folder (TODO: create smth better than this hack)
Friend.schema.virtual('image.src').get(function() {
  if (this.image && this.image.path && this.image.filename)
    return this.image.path.replace('public/', '') + '/' + this.image.filename
});

//Displayed columns in admin panel
Friend.defaultColumns = 'title|25%, link|25%, description|50%';
Friend.register();
