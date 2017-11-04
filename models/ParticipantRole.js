var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * ParticipantRole Model
 * =====================
 */

var ParticipantRole = new keystone.List('ParticipantRole', {
  autokey: { path: 'key', from: 'name', unique: true }
});

ParticipantRole.add({
  name: { type: String, initial: true, index: true, required: true },
  __ref: { type: String }
});

ParticipantRole.relationship({ ref: 'Participant', path: 'roles' });

ParticipantRole.register();
