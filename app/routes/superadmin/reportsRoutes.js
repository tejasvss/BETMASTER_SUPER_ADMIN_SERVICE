const express=require('express');
const router = new express.Router();

const ReportsController=require('../../controllers/superadmin/customerReportsController');
const adminAuthorization=require('../../config/adminAuthorization');


router.get('/getAllCustomerReports',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,ReportsController.getAllCustomerReports);
router.post('/changeReportStatus',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,ReportsController.changeReportStatus);
router.post('/replyToReport',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,ReportsController.replyToReport);
router.get('/getCustomerReport/:reportId',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,ReportsController.getCustomerReportByReportId)



module.exports=router;