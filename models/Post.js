var keystone = require('keystone');
var Types = keystone.Field.Types;
var moment = require('moment');

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
  autokey: { path: 'slug', from: 'title', unique: true },
  map: { name: 'title' },
  defaultSort: '-publishedDate'
});

Post.add({
  title: { type: String, required: true },
  state: { type: Types.Select, options: 'draft, published, archived, marker', default: 'draft', index: true },
  author: { type: Types.Relationship, ref: 'User', dependsOn: { state: ['draft', 'published', 'archived'] } },
  publishedDate: { type: Types.Date, index: true, dependsOn: { state: ['published', 'archived', 'marker'] } },
  image: { type: Types.LocalFile, dest: 'public/images/posts', prefix: '/images/posts', dependsOn: { state: ['draft', 'published', 'archived'] } },
  storyImages: { type: Types.LocalFiles, dest: 'public/images/posts', prefix: '/images/posts', dependsOn: { state: ['draft', 'published', 'archived'] } },
  categories: { type: Types.Relationship, ref: 'PostCategory', dependsOn: { state: ['draft', 'published', 'archived'] }},
  wolf: { type: Types.Relationship, ref: 'Wolf' },
  location: { type: Types.GeoPoint, dependsOn: { wolf: true } },
  content: {
    brief: { type: Types.Html, wysiwyg: true, height: 120, dependsOn: { state: ['draft', 'published', 'archived'] } },
    extended: { type: Types.Html, wysiwyg: true, height: 640, dependsOn: { state: ['draft', 'published', 'archived'] } }
  }
});

Post.schema.virtual('brief').get(function() {
  return this.content.brief || this.content.extended || '';
});

//Add post href
Post.schema.virtual('href').get(function() {
  return '/post/' + this.slug;
});

//Parse date with current language
Post.schema.virtual('formatedDate').get(function() {
  if(!this.publishedDate)
    return null;

  var momentDate = moment(this.publishedDate).locale("be");
      formatedDate = {
        day: momentDate.format('DD'),
        month: momentDate.format('MMMM'),
        year: momentDate.format('YYYY')
      }

  return formatedDate;
});

//Displayed columns in admin panel
Post.defaultColumns = 'title|40%, state|10%, author|10%, categories|15%, wolf|10%, publishedDate|15%';
Post.register();
