var router = require("express-promise-router")();
var fs = require('fs');
var multer = require('multer');
const brokerModel = require("../models/broker-model");
const bauthController = require('../controllers/bauth.controller')
var fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/slips')
    },
    filename: (req, file, cb) => {
         cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
});
const fileFilters = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only jpeg or png mimetype is accepted'), false);
    }

};

var upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilters: fileFilters });

router.post('/login', bauthController.login);
router.post('/signup',upload.array('image', 3),bauthController.signup);

module.exports = router;
