/**
 * A device is a mobile device used by a person to send location data
 * to determine contact monitoring.
 */
const mongo = require('../lib/mongo');

const TABLE_NAME = 'device';
function Device() {
	return mongo.getConnection().collection(TABLE_NAME);
}

module.exports = Device;
