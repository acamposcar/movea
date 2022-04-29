const { body } = require('express-validator');

exports.newMovieValidator = () => [
  body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('director', 'Director must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('synopsis', 'Synopsis must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('year').trim().isLength({ min: 1 }).escape()
    .withMessage('Year must not be empty.')
    .isInt({ min: 1500, max: 2100 })
    .withMessage('Year must be between 1500 and 2100.'),
  body('image').isURL().trim()
    .withMessage('Image must be an URL.')
    .isLength({ min: 1 })
    .withMessage('Image must not be empty.'),
  body('category.*').escape(),
];

exports.passwordValidator = () => [
  body('password', 'Invalid password')
    .custom((password, { req }) => {
      if (password !== process.env.ADMIN_PASSWORD) {
        // trow error if passwords do not match
        throw new Error("Passwords don't match");
      } else {
        return password;
      }
    }),
];
