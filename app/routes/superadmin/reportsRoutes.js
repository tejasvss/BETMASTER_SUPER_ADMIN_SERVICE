const express=require('express');
const router = new express.Router();

const ReportsController=require('../../controllers/superadmin/customerReportsController');


router.get('/getAllCustomerReports',ReportsController.getAllCustomerReports);
router.post('/changeReportStatus',ReportsController.changeReportStatus);
router.post('/replyToReport',ReportsController.replyToReport);



module.exports=router;