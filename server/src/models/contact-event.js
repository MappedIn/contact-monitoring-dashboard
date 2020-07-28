const mongo = require('../lib/mongo');

const TABLE_NAME = 'contact-event';
function ContactEvent() {
	return mongo.getConnection().collection(TABLE_NAME);
}

module.exports = ContactEvent;
