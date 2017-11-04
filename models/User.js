var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User', {
  autokey: { path: 'key', from: 'name', unique: true }
});

User.add({
  name: { type: Types.Name, required: true, index: true },
  email: { type: Types.Email, initial: true, required: true, index: true },
  password: { type: Types.Password, initial: true, required: true },
  __ref: { type: String },
}, 'Permissions', {
  isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

//Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
  return this.isAdmin;
});

//Get user's full name
User.schema.virtual('fullname').get(function() {
  return this.name.first + ' ' + this.name.last;
});


/**
 * Relationships
 */

User.relationship({ ref: 'Post', path: 'author' });
User.relationship({ ref: 'Promo', path: 'author' });
User.relationship({ ref: 'Survey', path: 'author' });

/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
