const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
  slag: String,
  title: {
    type: String,
    required: true,
  },
  parent_category: String,
  seo_description: String,
  seo_keyword: String,
});

module.exports = model('Category', categorySchema);
