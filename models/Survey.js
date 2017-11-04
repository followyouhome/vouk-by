var keystone = require('keystone');
var Types = keystone.Field.Types;
var moment = require('moment');

/**
 * Survey Model
 * ============
 */

var Survey = new keystone.List('Survey', {
  autokey: { path: 'slug', from: 'title', unique: true },
  map: { name: 'title' },
  defaultSort: '-publishedDate'
});

Survey.add({
  title: { type: String, required: true },
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  author: { type: Types.Relationship, ref: 'User' },
  publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
  image: { type: Types.LocalFile, dest: 'public/images/surveys', prefix: '/images/surveys' }
}, 'Pages', {
  blog: { type: Types.Boolean, label: 'Воўчы блог' },
  wolf: { type: Types.Boolean, label: 'Пашпарт ваўка'},
  about: { type: Types.Boolean, label: 'Аб праекце' },
  curious: { type: Types.Boolean, label: 'Цікавасці' },
  friends: { type: Types.Boolean, label: 'Нашы сябры' },
  support: { type: Types.Boolean, label: 'Падтрымайце праект'}
}, 'Survey options', {
  answers: { type: Types.TextArray },
  scores: { type: Types.TextArray } //Number array has issues with initial '0' in admin panel
});

//Add survey's href
Survey.schema.virtual('href').get(function() {
  return '/survey/' + this.slug;
});

//Parse date with current language
Survey.schema.virtual('formatedDate').get(function() {
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

//Get initial value
Survey.schema.post('init', function() {
  this._original = this.toObject();
});

//Get image's url
Survey.schema.virtual('image.src').get(function() {
  if(this.image && this.image.path && this.image.filename)
    return '/' + this.image.path.replace('public/', '') + '/' + this.image.filename
});

//Update list of scores
Survey.schema.pre('save', function(next) {
  var self = this;

  if(this.answers.length && !this.scores.length) { //TODO: implement logic for answers/scores deleting
    this.scores = Array(this.answers.length).fill(0);
  }

  next();
});

//Displayed columns in admin panel
Survey.defaultColumns = 'title|40%, publishedDate|20%, state|20%, author|20%';
Survey.register();
