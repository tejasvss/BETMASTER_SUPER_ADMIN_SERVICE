const express=require('express');
const router = new express.Router();

const adminController=require('../../controllers/superadmin/adminController');


router.post('/createSuperAdmin',adminController.createSuperAdmin);
router.post('/adminLogin',adminController.adminLogin)

module.exports=router;