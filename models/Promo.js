var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Promo Model
 * ===========
 */

var Promo = new keystone.List('Promo', {
  autokey: { path: 'slug', from: 'title', unique: true },
  map: { name: 'title' },
  defaultSort: '-publishedDate'
});

Promo.add({
  title: { type: String, required: true },
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  author: { type: Types.Relationship, ref: 'User', index: true },
  publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
  image: { type: Types.LocalFile, dest: 'public/images/promos', prefix: '/images/promos' },
  content: { type: Types.Html, wysiwyg: true, height: 150 }
}, 'Pages', {
  blog: { type: Types.Boolean, label: 'Воўчы блог'},
  wolf: { type: Types.Boolean, label: 'Пашпарт ваўка'},
  about: { type: Types.Boolean, label: 'Аб праекце' },
  curious: { type: Types.Boolean, label: 'Цікавасці' },
  friends: { type: Types.Boolean, label: 'Нашы сябры' },
  support: { type: Types.Boolean, label: 'Падтрымайце праект'}
});

//Get image's url
Promo.schema.virtual('image.src').get(function() {
  if(this.image && this.image.path && this.image.filename)
    return '/' + this.image.path.replace('public/', '') + '/' + this.image.filename
});

//Displayed columns in admin panel
Promo.defaultColumns = 'title|40%, publishedDate|20%, state|20%, author|20%';
Promo.register();
