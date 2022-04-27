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
    image: { type: String },
  },
);

// Virtual URL
MovieSchema
  .virtual('url')
  .get(() => `/catalog/movie/${this._id}`);

// Virtual URL
MovieSchema
  .virtual('image_url')
  .get(() => `/assets/movie/${this._id}/${this.image}`);

// Export model
module.exports = mongoose.model('Movie', MovieSchema);
