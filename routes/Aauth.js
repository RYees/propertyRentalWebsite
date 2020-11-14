var router = require("express-promise-router")();

const { adminFormRequest } = require('../middlewares/form-request/admin')
const AauthController = require('../controllers/Aauth.controller')

/* GET users listing. adminFormRequest('createAdmin'),,*/
router.post('/login',adminFormRequest('loginAdmin'), AauthController.login);
router.post('/signup',adminFormRequest('createAdmin'),AauthController.signup);
router.get('/logout',AauthController.logout);
module.exports = router;
