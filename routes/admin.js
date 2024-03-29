var router = require("express-promise-router")();

const { hasPermissions } = require('../middlewares/auth');
const adminController = require('../controllers/admin.controller')


router.get('/adminprofile', hasPermissions(['view profile']),adminController.adminprofile);

router.patch('/updateInfo', hasPermissions(['view broker']), adminController.profileupdate);

router.delete('/deleteAccount', hasPermissions(['remove account']), adminController.profileremove);



router.get('/allbrokers', hasPermissions(['view any broker']), adminController.Allbrokers);

router.get('/broker/:id', hasPermissions(['view broker']), adminController.getbroker);

router.put('/:id/fcm',hasPermissions(['view notification']), adminController.savefcm);

router.patch('/brokerStatus/:id', hasPermissions(['grant access']),adminController.updateBstatus);

router.patch('/propertyStatus/:id', hasPermissions(['grant access']),adminController.updatePstatus);

router.delete('/broker/:id', hasPermissions(['remove broker']), adminController.removebroker);



router.get('/getallproperty', hasPermissions(['view any property']), adminController.getAllpropertys);

router.get('/property/:id', hasPermissions(['view property']), adminController.getproperty);

router.delete('/property/:id', hasPermissions(['remove property']), adminController.removeproperty);



module.exports = router;
