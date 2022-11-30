const { Schema, model } = require('mongoose');

const viewSchema = new Schema({
  postId: {
    type: String,
    required: true,
  },
  userIp: String,
  method: String,
  host: String,
  url: String,
  referer: String,
  user_agent: String,
  country: String,
  device: String,
  operating: String,
  browser: String,
  browser_version: String,
  time_zone: String,
  asn: String,
  asn_org: String,
  date_at: String,
});

module.exports = model('View', viewSchema);
