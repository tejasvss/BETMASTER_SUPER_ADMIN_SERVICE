const express=require('express');
const router = new express.Router();

const dashboardController=require('../../controllers/superadmin/dashboardController');
const adminAuthorization=require('../../config/adminAuthorization');


router.get('/getstatistics',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,dashboardController.getstatistics);
router.get('/getDashboard',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,dashboardController.getDashboard)

module.exports=router;