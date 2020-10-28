var router = require("express-promise-router")();

const  {authFormRequest} = require('../middlewares/form-request/auth')
const AauthController = require('../controllers/Aauth.controller')

/* GET users listing. */
router.post('/login', AauthController.login);
router.post('/signup',authFormRequest('createUser'), AauthController.signup);

module.exports = router;
