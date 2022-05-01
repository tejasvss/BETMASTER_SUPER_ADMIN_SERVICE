const express=require('express');
const router=new express.Router();
const baseURL="/superAdminService"

//Admin_Routes
router.use(baseURL,require('./adminRoutes'));
router.use(baseURL,require('./reportsRoutes'));
router.use(baseURL,require('./customerRoutes'));
router.use(baseURL,require('./dashboardRoutes'));

  
module.exports = router;
  