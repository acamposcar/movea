const async = require('async');
const { body, validationResult } = require('express-validator');
const Movie = require('../models/movie');
const Category = require('../models/category');

exports.index = (req, res) => {
  Movie.find({})
    .sort({ title: 1 })
    .populate('category')
    .exec((err, listMovies) => {
      res.render('index', { error: err, list_movies: listMovies });
    });
};

// Display detail page for a specific movie
exports.getMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .sort({ title: 1 })
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

      res.render('create_movie', { categoriesList });
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
  body('year').trim().escape()
    .withMessage('Year must not be empty')
    .isInt({ min: 1500, max: 2100 })
    .withMessage('Year must be between 1500 and 2100.'),
  body('image').optional({ checkFalsy: true }).trim().escape(),
  body('category.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
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
        res.render('create_movie', { categoriesList, movie, errors: errors.array() });
      });
    } else {
      // Data from form is valid. Save book.
      movie.save((err) => {
        if (err) { return next(err); }
        // successful - redirect to new book record.
        res.redirect(movie.url);
      });
    }
  },
];
