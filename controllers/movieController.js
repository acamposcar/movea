const async = require('async');
const { body, validationResult } = require('express-validator');
const Movie = require('../models/movie');
const Category = require('../models/category');

exports.index = (req, res) => {
  Movie.find({})
    .sort({ title: 1 })
    .populate('category')
    .exec((err, listMovies) => {
      res.render('index', { error: err, listMovies });
    });
};

// Display detail page for a specific movie
exports.getMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .populate('category')
    .exec((err, movie) => {
      if (err) return next(err);

      if (movie == null) {
        // No results.
        const error = new Error('Movie not found');
        error.status = 404;
        return next(err);
      }

      res.render('movie_detail', { movie });
    });
};

// Delete specific movie
exports.deleteMovie = (req, res, next) => {
  Movie.findByIdAndRemove(req.body.id, (err) => {
    if (err) { return next(err); }

    res.redirect('/movies');
  });
};

// Display form to create a new movie
exports.getCreateMovie = (req, res, next) => {
  Category.find({})
    .exec((err, categoriesList) => {
      if (err) return next(err);

      res.render('movie_form', { categoriesList });
    });
};

// Handle movie create on POST.
exports.postCreateMovie = [
  // Convert the categories to an array.
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') { req.body.category = []; } else { req.body.category = new Array(req.body.category); }
    }
    next();
  },

  // Validate and sanitize fields.
  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('director', 'Director must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('year').trim().isLength({ min: 1 }).escape()
    .withMessage('Year must not be empty.')
    .isInt({ min: 1500, max: 2100 })
    .withMessage('Year must be between 1500 and 2100.'),
  body('image').optional({ checkFalsy: true }).trim().escape(),
  body('category.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Movie object with escaped and trimmed data.
    const movie = new Movie(
      {
        title: req.body.title,
        director: req.body.director,
        summary: req.body.summary,
        year: req.body.year,
        category: req.body.category,
        image: req.body.image,
      },
    );

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      Category.find({}).exec((err, categoriesList) => {
        if (err) return next(err);

        // Mark our selected categories as checked.
        for (let i = 0; i < categoriesList.length; i++) {
          if (movie.category.indexOf(categoriesList[i]._id) > -1) {
            categoriesList[i].checked = 'true';
          }
        }
        res.render('movie_form', { categoriesList, movie, errors: errors.array() });
      });
    } else {
      // Data from form is valid. Save movie.
      movie.save((err) => {
        if (err) { return next(err); }
        // successful - redirect to new movie record.
        res.redirect(movie.url);
      });
    }
  },
];

// Display book update form on GET.
exports.getUpdateMovie = function (req, res, next) {
  // Get book, authors and categories for form.

  async.parallel({
    movie(callback) {
      Movie.findById(req.params.id).populate('category').exec(callback);
    },
    categories(callback) {
      Category.find(callback);
    },
  }, (err, results) => {
    if (err) { return next(err); }
    if (results.movie == null) { // No results.
      const err = new Error('Movie not found');
      err.status = 404;
      return next(err);
    }
    // Success.
    // Mark our selected categories as checked.
    for (let i = 0; i < results.categories.length; i++) {
      for (let j = 0; j < results.movie.category.length; j++) {
        if (results.categories[i]._id.toString()
         === results.movie.category[j]._id.toString()) {
          results.categories[i].checked = 'true';
        }
      }
    }
    res.render('movie_form', { movie: results.movie, categories: results.categories });
  });
};

// Handle book update on POST.
exports.putUpdateMovie = [

  // Convert the category to an array
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') { req.body.category = []; } else { req.body.category = new Array(req.body.category); }
    }
    next();
  },

  // Validate and sanitize fields.
  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('director', 'Director must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('year').trim().isLength({ min: 1 }).escape()
    .withMessage('Year must not be empty.')
    .isInt({ min: 1500, max: 2100 })
    .withMessage('Year must be between 1500 and 2100.'),
  body('image').optional({ checkFalsy: true }).trim().escape(),
  body('category.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped/trimmed data and old id.
    const movie = new Movie(
      {
        title: req.body.title,
        director: req.body.director,
        summary: req.body.summary,
        year: req.body.year,
        image: req.body.image,
        category: req.body.category,
        _id: req.params.id, // This is required, or a new ID will be assigned!
      },
    );

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      Category.find({}).exec((err, categoriesList) => {
        if (err) return next(err);

        // Mark our selected categories as checked.
        for (let i = 0; i < categoriesList.length; i++) {
          if (movie.category.indexOf(categoriesList[i]._id) > -1) {
            categoriesList[i].checked = 'true';
          }
        }
        res.render('movie_form', { categoriesList, movie, errors: errors.array() });
      });
    } else {
      // Data from form is valid. Update the record.
      Movie.findByIdAndUpdate(req.params.id, movie, {}, (err, themovie) => {
        if (err) { return next(err); }
        // Successful - redirect to book detail page.
        res.redirect(themovie.url);
      });
    }
  },
];
