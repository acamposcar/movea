/* eslint-disable consistent-return */

const { validationResult } = require('express-validator');
const middleware = require('../middleware/middleware');
const Movie = require('../models/movie');
const Category = require('../models/category');
const validation = require('../validation/validation');

exports.index = async (req, res) => {
  try {
    const listMovies = await Movie.find({}).populate('category');
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

// Display detail page for deleting a specific movie
exports.getDeleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (movie == null) {
      // No results.
      const err = new Error('Movie not found');
      err.status = 404;
      return next(err);
    }
    res.render('delete_movie', { movie, errors: [] });
  } catch (err) {
    return next(err);
  }
};

exports.deleteMovie = [

  validation.passwordValidator(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      try {
        const movie = await Movie.findById(req.params.id);

        if (movie == null) {
          // No results.
          const err = new Error('Movie not found');
          err.status = 404;
          return next(err);
        }
        // There are errors. Render form again with sanitized values/error messages.
        res.render('delete_movie', { movie, errors: errors.array() });
      } catch (err) {
        return next(err);
      }
    } else {
      try {
        await Movie.findByIdAndRemove(req.params.id);
        res.redirect('/movies');
      } catch (err) {
        return next(err);
      }
    }
  },
];

// Display form to create a new movie
exports.getCreateMovie = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.render('new_movie', {
      title: 'Add Movie',
      errors: [],
      categories,
      movie: {},
      method: 'POST',
    });
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

    res.render('new_movie', {
      title: 'Update Movie',
      movie,
      categories,
      errors: [],
      method: 'PUT',
    });
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
    delete movie._id;
    console.log(movie);
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, movie, {});
      res.redirect(updatedMovie.url);
    } catch (err) {
      return next(err);
    }
  },
];
