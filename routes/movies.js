const express = require('express');

const router = express.Router();

const movieController = require('../controllers/movieController');

/* GET users listing. */
router.get('/', movieController.index);
router.get('/:id', movieController.movieDetail);

module.exports = router;
