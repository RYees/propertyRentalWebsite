var router = require("express-promise-router")();
var mongoose = require('mongoose');
var fs = require('fs');
var multer = require('multer');
const brokerModel = require('../models/broker-model')
const propertyController = require('../controllers/property.controller')
const propertyModel = require('../models/property-model')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
  })
  
  var upload = multer({ storage: storage })



router.post('/', upload.array('image', 5),
//  function(req, res, next) {
//     var image = req.files;
//     var title = req.body.title;
//     console.log(title);
//     res.send(image);
    
   propertyController.create);
router.get('/', propertyController.getAll);
router.get('/search', propertyController.search);





router.get('/:id', propertyController.get);
//router.post('/',  upload.array('image', 12), propertyController.create);
router.patch('/:id', propertyController.update);

router.delete('/:id', propertyController.remove);



module.exports = router;
