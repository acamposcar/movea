const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/categoryController');

/* GET users listing. */
router.get('/', categoryController.index);
router.get('/:id', categoryController.categoryDetail);

module.exports = router;
