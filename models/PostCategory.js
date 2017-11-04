var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * PostCategory Model
 * ==================
 */

var PostCategory = new keystone.List('PostCategory', {
  autokey: { path: 'key', from: 'name', unique: true }
});

PostCategory.add({
  name: { type: String, initial: true, index: true, required: true },
  __ref: { type: String }
});

PostCategory.relationship({ ref: 'Post', path: 'categories' });

PostCategory.register();
