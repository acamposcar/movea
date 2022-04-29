/* eslint-disable consistent-return */

const Category = require('../models/category');
const Movie = require('../models/movie');

exports.index = async (req, res) => {
  try {
    const listCategories = await Category.find({}).sort({ name: 1 });
    res.render('category_index', { error: null, listCategories });
  } catch (err) {
    res.render('category_index', { error: err, listCategories: [] });
  }
};

// Display detail page for a specific movie
exports.getCategory = async (req, res, next) => {
  try {
    const [category, movies] = await Promise.all(
      [Category.findById(req.params.id), Movie.find({ category: req.params.id })],
    );

    if (category == null) {
      // No results.
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    res.render('category_detail', { category, movies });
  } catch (err) {
    return next(err);
  }
};
