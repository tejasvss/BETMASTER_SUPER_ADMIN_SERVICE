const express=require('express');
const router = new express.Router();
const multer = require("multer");


const adminController=require('../../controllers/superadmin/adminController');
const adminAuthorization=require('../../config/adminAuthorization');

const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, '')
    }
})

const upload = multer({ storage: storage }).single('file');

router.post('/createSuperAdmin',adminController.createSuperAdmin);
router.post('/adminLogin',adminController.adminLogin);
router.post('/updateAdminName',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,adminController.updateAdminName);
router.post('/updateProfileImage',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,upload,adminController.updateProfileImage);
router.get('/getAdminProfile',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,adminController.getAdminProfile);
router.get('/adminLogout',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,adminController.adminLogout);
router.get('/getSuperAdminActivity',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,adminController.getSuperAdminActivity)

module.exports=router;