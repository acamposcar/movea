const { body } = require('express-validator');

exports.newMovieValidator = () => [
  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('director', 'Director must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('year').trim().isLength({ min: 1 }).escape()
    .withMessage('Year must not be empty.')
    .isInt({ min: 1500, max: 2100 })
    .withMessage('Year must be between 1500 and 2100.'),
  body('image').optional({ checkFalsy: true }).trim().escape(),
  body('category.*').escape(),
];
