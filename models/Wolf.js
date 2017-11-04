var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Wolf Model
 * ==========
 */

var Wolf = new keystone.List('Wolf', {
  autokey: { path: 'slug', from: 'name', unique: true },
  defaultColumns: 'name, age, weight, length'
});

Wolf.add({
  name: { type: String, required: true },
  __ref: { type: String },
  avatar: {
    type: Types.LocalFile,
    dest: 'public/images/wolves',
    prefix: '/images/wolves',
    filename: function(item, file){
      return item.slug + '-' + file.originalname; //I prefer this than id
    }
  },
  mapColor: { type: Types.Color, required: true, default: '#000000' }
}, 'Physical characteristics', {
  sex: { type: Types.Select, options: 'Самец, Самка', default: 'Самец', index: true },
  age: { type: String },
  weight: { type: String },
  length: { type: String },
  canines: { type: String }
}, 'Description', {
  info: { type: Types.Textarea },
  feature: { type: String },
  birthplace: { type: String, default: 'Беларусь, Белавежская пушча' },
  socialStatus: { type: String }
}, 'Other', {
  territoryCoordinates: { type: Types.TextArray }
});

Wolf.relationship({ ref: 'Post', path: 'wolves' });

//Add wolf href
Wolf.schema.virtual('href').get(function() {
  return '/wolf/' + this.slug;
});

//Parse wolf's characteristics
Wolf.schema.virtual('ageValue').get(function() {
  return this.age.split(' ')[0];
});

Wolf.schema.virtual('ageText').get(function() {
  return this.age.split(' ')[1];
});

Wolf.schema.virtual('weightValue').get(function() {
  return this.weight.split(' ')[0];
});

Wolf.schema.virtual('weightText').get(function() {
  return this.weight.split(' ')[1];
});

Wolf.schema.virtual('lengthValue').get(function() {
  return this.length.split(' ')[0];
});

Wolf.schema.virtual('lengthText').get(function() {
  return this.length.split(' ')[1];
});

Wolf.schema.virtual('prefix').get(function() {
  return this.sex == 'Самец' ? 'Воўк' : 'Ваўчыца';
});

//Fix url for images locaed in public folder (TODO: create smth better than this hack)
Wolf.schema.virtual('avatar.src').get(function() {
  if(this.avatar && this.avatar.path && this.avatar.filename)
    return '/' + this.avatar.path.replace('public/', '') + '/' + this.avatar.filename
});

//Displayed columns in admin panel
Wolf.defaultColumns = 'name|15%, sex|15%, feature|35%, birthplace|35%';
Wolf.register();
