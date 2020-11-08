var router = require("express-promise-router")();
var mongoose = require('mongoose');
const propertyController = require('../controllers/property.controller')

router.get('/', propertyController.getAll);
router.get('/search', propertyController.search);

module.exports = router;
