const express = require('express');

const router = express.Router();

const movieController = require('../controllers/movieController');

// GET categories home page
router.get('/', movieController.index);

// GET create movie form
router.get('/create', movieController.getCreateMovie);

// POST create movie
router.post('/create', movieController.postCreateMovie);

// GET request for one movie
router.get('/:id', movieController.getMovie);

// DELETE one movie
router.get('/:id/delete', movieController.getDeleteMovie);

// DELETE one movie
router.delete('/:id/delete', movieController.deleteMovie);

// GET update movie form
router.get('/:id/update', movieController.getUpdateMovie);

// PUT update movie
router.put('/:id/update', movieController.putUpdateMovie);

module.exports = router;
