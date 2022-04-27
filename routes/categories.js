const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/categoryController');

// GET categories home page
router.get('/', categoryController.index);

// GET request for one category
router.get('/:id', categoryController.get_category);

// UPDATE one category
router.update('/:id', categoryController.update_category);

// DELETE one category
router.delete('/:id', categoryController.delete_category);

// GET new category form
router.post('/create', categoryController.create_category);

// POST create category
router.post('/create', categoryController.create_category);

module.exports = router;
