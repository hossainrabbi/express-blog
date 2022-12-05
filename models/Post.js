const { Schema, model } = require('mongoose');

const postSchema = new Schema(
  {
    slug: String,
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tag: String,
    featured_image: String,
    author: String,
    seo_description: String,
    seo_keyword: String,
    view: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Post', postSchema);
