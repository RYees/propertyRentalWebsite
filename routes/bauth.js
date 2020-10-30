var router = require("express-promise-router")();

const  {authFormRequest} = require('../middlewares/form-request/auth')
const bauthController = require('../controllers/bauth.controller')
//const { roles } = require('../middlewares/roles');
/* GET users listing. */
router.post('/login', bauthController.login);
router.post('/signup',bauthController.signup);

module.exports = router;
