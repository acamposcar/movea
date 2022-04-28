/* eslint-disable consistent-return */

const { validationResult } = require('express-validator');
const validation = require('../validation/validation');
const Movie = require('../models/movie');
const Category = require('../models/category');

exports.createUpdateMovie = [

  // Convert the categories to an array.
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') { req.body.category = []; } else { req.body.category = new Array(req.body.category); }
    }
    next();
  },

  // Validate and sanitize fields.
  validation.newMovieValidator(),
  // Process request after validation and sanitization.
  async (req, res, next) => {
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
      req.movie = movie;
      next();
    }
  },
];
