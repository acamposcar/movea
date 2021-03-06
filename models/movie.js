const mongoose = require('mongoose');

const { Schema } = mongoose;

const MovieSchema = new Schema(
  {
    title: { type: String, required: true, maxLength: 200 },
    director: { type: String, required: true, maxLength: 100 },
    year: {
      type: Number, required: true, min: 1500, max: 2100,
    },
    category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    image: { type: String, required: true },
    synopsis: { type: String, required: true },
  },
);

// Virtual URL
MovieSchema
  .virtual('url')
  .get(function () { return `/movies/${this._id}`; });

// Virtual URL
MovieSchema
  .virtual('image_url')
  .get(function () { return `/assets/movies/${this._id}/${this.image}`; });

// Export model
module.exports = mongoose.model('Movie', MovieSchema);
