var router = require("express-promise-router")();
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

var upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter: fileFilter });
//const  {authFormRequest} = require('../middlewares/form-request/auth')
const bauthController = require('../controllers/bauth.controller')

/* GET users listing. */
router.post('/login', bauthController.login);
router.post('/signup',upload.single("photo"),bauthController.signup);

module.exports = router;
