var router = require("express-promise-router")();
var mongoose = require('mongoose');
const commentController = require('../controllers/comment.controller')
const commentModel = require('../models/comment-model')
const brokerModel = require('../models/broker-model')

router.get('/', commentController.getAll);
router.get('/:id', commentController.get);
router.post('/', commentController.create);


module.exports = router;
