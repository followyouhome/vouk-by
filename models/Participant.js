var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Participant Model
 * =================
 */

var Participant = new keystone.List('Participant', {
  autokey: { path: 'key', from: 'fullname', unique: true },
  map: { name: 'fullname' }
});

Participant.add({
  fullname: { type: String, },
  jobtitle: { type: String },
  company: { type: String},
  roles: { type: Types.Relationship, ref: 'ParticipantRole', many: true},
  photo: { type: Types.LocalFile, dest: 'public/images/participants', prefix: '/images/participants' }
});

//Fix url for images located in public folder (TODO: create smth better than this hack)
Participant.schema.virtual('photo.src').get(function() {
  if (this.photo && this.photo.path && this.photo.filename)
    return this.photo.path.replace('public/', '') + '/' + this.photo.filename
});

//Displayed columns in admin panel
Participant.defaultColumns = 'fullname|25%, jobtitle|25%, company|50%';
Participant.register();
