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
  validation.passwordValidator(),
  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a Book object with escaped/trimmed data and old id.
    let movie;
    if (req.method === 'PUT') {
      // PUT method on update.
      movie = new Movie(
        {
          title: req.body.title,
          director: req.body.director,
          synopsis: req.body.synopsis,
          year: req.body.year,
          image: req.body.image,
          category: req.body.category,
          _id: req.params.id, // necessary to update item
        },
      );
    } else {
      // POST method on create.
      movie = new Movie(
        {
          title: req.body.title,
          director: req.body.director,
          synopsis: req.body.synopsis,
          year: req.body.year,
          image: req.body.image,
          category: req.body.category,
        },
      );
    }

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      try {
        // Add .lean() to get a Javascipt object to be able to add checked property
        const categories = await Category.find().lean();

        // Mark our selected categories as checked.
        for (let i = 0; i < categories.length; i++) {
          if (movie.category.indexOf(categories[i]._id) > -1) {
            categories[i].checked = 'true';
          }
        }
        if (req.method === 'PUT') {
        // PUT method on update.
          res.render('new_movie', {
            title: 'Update Movie',
            categories,
            movie,
            errors: errors.array(),
            method: 'PUT',
          });
        } else {
          res.render('new_movie', {
            title: 'Add Movie',
            categories,
            movie,
            errors: errors.array(),
            method: 'POST',
          });
        }
      } catch (err) {
        return next(err);
      }
    } else {
      // Data from form is valid. Update the record.
      req.movie = movie;
      next();
    }
  },
];
