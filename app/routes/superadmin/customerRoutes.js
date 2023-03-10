const express=require('express');
const router = new express.Router();

const customerController=require('../../controllers/superadmin/customerController');
const adminAuthorization=require('../../config/adminAuthorization');


router.get('/getAllCustomers',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,customerController.getAllCustomers);
router.post('/blockCustomer',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,customerController.blockCustomer);
router.post('/unblockCustomer',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,customerController.unBlockCustomer);
router.get('/getAllBlockedCustomers',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,customerController.getAllBlockedCustomers);
router.post('/changeCustomerState',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,customerController.changeCustomerState)
router.post('/deleteCustomer',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,customerController.deleteCustomer);
router.get('/getCustomerErrorLogs',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,customerController.getCustomerErrorLogs);
router.post('/getCustomer',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,customerController.getCustomer);
router.post('/editCustomerNote',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,customerController.editCustomerNote);
router.post('/transferMoneyToUsers',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,customerController.transferMoneyToUsers);
router.post('/deductMoneyFromUsers',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,customerController.deductMoneyFromUsers);
router.post('/getCustomerActivity',adminAuthorization.verifyToken,adminAuthorization.isSuperAdmin,customerController.getCustomerActivity);

module.exports=router;