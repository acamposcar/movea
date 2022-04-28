/* eslint-disable consistent-return */

const middleware = require('../middleware/middleware');
const Movie = require('../models/movie');
const Category = require('../models/category');

exports.index = async (req, res) => {
  try {
    const listMovies = await Movie.find({}).sort({ title: 1 }).populate('category');
    res.render('index', { error: null, listMovies });
  } catch (err) {
    res.render('index', { error: err, listMovies: [] });
  }
};

// Display detail page for a specific movie
exports.getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('category');

    if (movie == null) {
      // No results.
      const err = new Error('Movie not found');
      err.status = 404;
      return next(err);
    }
    res.render('movie_detail', { movie });
  } catch (err) {
    return next(err);
  }
};

// Delete specific movie
exports.deleteMovie = async (req, res, next) => {
  try {
    await Movie.findByIdAndRemove(req.body.id);
    res.redirect('/movies');
  } catch (err) {
    return next(err);
  }
};

// Display form to create a new movie
exports.getCreateMovie = async (req, res, next) => {
  try {
    const categoriesList = await Category.find({});
    res.render('movie_form', { categoriesList });
  } catch (err) {
    return next(err);
  }
};

// Handle movie create on POST.
exports.postCreateMovie = [
  // Validate data
  middleware.createUpdateMovie,

  // Data from form is valid. Save the movie.
  async (req, res, next) => {
    const { movie } = req;
    try {
      await movie.save();
      // successful - redirect to new movie record.
      res.redirect(movie.url);
    } catch (err) {
      return next(err);
    }
  },

];

// Display book update form on GET.
exports.getUpdateMovie = async (req, res, next) => {
  try {
    const [movie, categories] = await Promise.all([Movie.findById(req.params.id).populate('category'), Category.find()]);
    if (movie == null) { // No results.
      const err = new Error('Movie not found');
      err.status = 404;
      return next(err);
    }
    // Success.
    // Mark our selected categories as checked.
    for (let i = 0; i < categories.length; i++) {
      for (let j = 0; j < movie.category.length; j++) {
        if (categories[i]._id.toString()
         === movie.category[j]._id.toString()) {
          categories[i].checked = 'true';
        }
      }
    }

    res.render('movie_form', { movie, categories });
  } catch (err) {
    return next(err);
  }
};

// Handle book update on POST.
exports.putUpdateMovie = [

  // Validate data
  middleware.createUpdateMovie,

  // Data from form is valid. Update the record.
  async (req, res, next) => {
    const { movie } = req;
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, movie, {});
      res.redirect(updatedMovie.url);
    } catch (err) {
      return next(err);
    }
  },
];
