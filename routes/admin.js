var router = require("express-promise-router")();

const  {userFormRequest} = require('../middlewares/form-request/user')
const { hasPermissions } = require('../middlewares/auth');
const adminController = require('../controllers/admin.controller')

//router.get('/',adminController.getadmin);




router.get('/allbrokers', hasPermissions([ 'view any broker']),adminController.Allbrokers);

router.get('/broker/:id',hasPermissions(['view broker']),adminController.getbroker);

router.put('/:id/fcm',adminController.savefcm);

router.post('/createbroker', hasPermissions(['create broker']),adminController.createbroker);

//router.patch('/brokerStatus', hasPermissions(['remove user'])&& userFormRequest('createUser'),adminController.updatestatus);

router.patch('/broker/:id', hasPermissions(['update broker']), adminController.updatebroker);

router.delete('/broker/:id',hasPermissions(['remove broker']),adminController.removebroker);



router.get('/getallproperty', hasPermissions([ 'view property']),adminController.getAllpropertys);

router.get('/property/:id', hasPermissions(['view property']),adminController.getproperty);

//router.post('/createproperty', hasPermissions(['create property']), adminController.createproperty);

router.patch('/property/:id', hasPermissions(['update property']), adminController.updateproperty);

router.delete('/property/:id', hasPermissions(['remove property']),adminController.removeproperty);




router.get('/getallcomment', hasPermissions(['view comment']),adminController.getAllcomments);

router.get('/comment/:id', hasPermissions(['view comment']),adminController.getcomment);

router.post('/createcomment', hasPermissions(['create comment']),adminController.createcomment);

router.patch('/comment/:id', hasPermissions(['update comment']), adminController.updatecomment);

router.delete('/comment/:id', hasPermissions(['remove comment']),adminController.removecomment);

module.exports = router;
