const express = require('express');

const router = express.Router();

/* Redirect to movies */
router.get('/', (req, res, next) => {
  res.redirect('/movies');
});

module.exports = router;
