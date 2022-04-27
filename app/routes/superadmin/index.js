const express=require('express');
const router=new express.Router();
const baseURL="/superAdminService"

//Admin_Routes
router.use(baseURL,require('./adminRoutes'));
router.use(baseURL,require('./reportsRoutes'));

  
module.exports = router;
  