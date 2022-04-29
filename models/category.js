const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, maxLength: 100 },
  },
);

// Virtual URL
CategorySchema
  .virtual('url')
  .get(function () { return `/categories/${this._id}`; });

// Export model
module.exports = mongoose.model('Category', CategorySchema);
