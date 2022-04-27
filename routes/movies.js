const express = require('express');

const router = express.Router();

const movieController = require('../controllers/movieController');

// GET categories home page
router.get('/', movieController.index);

// GET request for one movie
router.get('/:id', movieController.get_movie);

// UPDATE one movie
router.update('/:id', movieController.update_movie);

// DELETE one movie
router.delete('/:id', movieController.delete_movie);

// GET new movie form
router.post('/create', movieController.create_movie);

// POST create movie
router.post('/create', movieController.create_movie);

module.exports = router;
