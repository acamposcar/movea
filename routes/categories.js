const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/categoryController');

// GET categories home page
router.get('/', categoryController.index);

// GET request for one category
router.get('/:id', categoryController.getCategory);

// // GET update category form
// router.get('/:id/update', categoryController.getUpdateCategory);

// // PUT update category
// router.put('/:id/update', categoryController.putUpdateCategory);

// // DELETE one category
// router.delete('/:id', categoryController.deleteCategory);

// // GET create category form
// router.get('/create', categoryController.getCreateCategory);

// // POST create category
// router.post('/create', categoryController.postCreateCategory);

module.exports = router;
