var router = require("express-promise-router")();
var mongoose = require('mongoose');
var fs = require('fs');
var multer = require('multer');
const brokerModel = require('../models/broker-model')
const propertyController = require('../controllers/property.controller')
const propertyModel = require('../models/property-model')

var storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'public/images')
    },
    filename: (req,file,cb) => {
        //cb(null,new Date().toISOString()+ file.originalname);
        cb(null,file.fieldname + '-' + Date.now() + file.originalname)
    }
});
const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
        cb(new Error('Only jpeg or png mimetype is accepted'),false);
    }

};
const upload = multer({storage: storage,  limits : {fileSize : 1000000}
});
//var upload = multer({storage: storage, limits: {fileSize: 1024 * 1024 * 5}, fileFilter:fileFilter});
//var upload = multer({storage: storage});

//router.get('/all',propertyController.All);

router.get('/',propertyController.getAll);
router.get('/search',propertyController.search);
router.get('/:id',propertyController.get);
router.post('/', upload.array("image",4), propertyController.create);
router.patch('/:id', propertyController.update);

router.delete('/:id', propertyController.remove);



module.exports = router;
