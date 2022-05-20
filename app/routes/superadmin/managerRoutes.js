const express=require('express');
const router = new express.Router();

const managerController=require('../../controllers/superadmin/managerController');
const adminAuthorization=require('../../config/adminAuthorization');

router.post('/createManager',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,managerController.createManager);
router.get('/getLatestManagers',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,managerController.getLatestManagers)

module.exports=router;
