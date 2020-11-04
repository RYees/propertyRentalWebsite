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
    destination: (req, file, cb) => {
        cb(null, 'public/broPhotos')
    },
    filename: (req, file, cb) => {
        //cb(null,new Date().toISOString()+ file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only jpeg or png mimetype is accepted'), false);
    }

};
/*var up = function (req,res) {
    upload(req,res,function (err) {
        if(err){
            return res,send("error uploading file");
        }
        res.end("File is uploaded")
    });
}/*/
var upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter });
//var upload = multer({ storage : storage }).array('file',2);

//router.get('/',/* hasPermissions(['view broker'])*/brokerController.All);

router.get('/profile', hasPermissions(['view broker']), brokerController.profile);

router.post('/', upload.single('photo'), hasPermissions(['view broker']), brokerController.create);

router.patch('/:id', hasPermissions(['update broker']), brokerController.update);

router.delete('/:id', hasPermissions(['remove broker']), brokerController.remove);

router.post('/createproperty', hasPermissions(['view broker']),upload.single("image"),brokerController.createproperty);

router.patch('/updateproperty/:id',hasPermissions(['view broker']),brokerController.updateproperty);

router.delete('/deleteproperty/:id', hasPermissions(['view broker']),brokerController.removeproperty);


module.exports = router;
