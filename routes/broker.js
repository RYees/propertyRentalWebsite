var router = require("express-promise-router")();
var fs = require('fs');
var multer = require('multer');
const { brokerFormRequest } = require('../middlewares/form-request/broker')
const { hasPermissions } = require('../middlewares/auth');
const brokerController = require('../controllers/broker.controller')
var mongoose = require('mongoose');
var fs = require('fs');
var multer = require('multer');
const brokerModel = require("../models/broker-model");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    },
      });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only jpeg or png mimetype is accepted'), false);
    }
};
    var upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter });



    
router.get('/profile', hasPermissions(['view profile']), brokerController.profile);

router.patch('/propertyStatus/:id', hasPermissions(['hold property']),brokerController.changestatus);

router.patch('/personalInfo', hasPermissions(['update broker']), brokerController.update);

router.delete('/deleteAccount', hasPermissions(['remove broker']), brokerController.remove);

router.get('/getproperty', hasPermissions(['view property']), brokerController.getproperty);

router.post('/createproperty', hasPermissions(['create property']),upload.array('image', 3),brokerController.createproperty);

router.patch('/updateproperty/:id',hasPermissions(['update property']),brokerController.updateproperty);

router.delete('/deleteproperty/:id', hasPermissions(['remove property']),brokerController.removeproperty);


module.exports = router;

