const Admin=require('../../models/superadmin/admin');
const generateId=require('../../utils/helpers/generateId');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const appsConfig=require('../../constants/appConstants.json');
const AWS=require('aws-sdk');
const ActivityRecord=require('../../models/superadmin/activityRecord');
const {CustomerDeposits,CustomerWithdrawls,Customer}=require('../../models/customer/customerModels');


/*-----------------------Creating_Super_Admin------------------*/
exports.createSuperAdmin=async(req,res)=>{

    try{
     
        const password=await bcrypt.hash(req.body.password,8);
        const adminId=await generateId("adminid",8);
        console.log("adminId",adminId)
        const body={email:req.body.email,mobileNumber:req.body.mobileNumber,countryCode:req.body.countryCode,password:password,adminId:adminId,fundManagement:true,userManagement:true,role:"superadmin"};

        const adminData=await Admin.create(body);

        return res.status(200).send({status:200,Message:"Super admin created successfully",Data:adminData})
    
    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "something went wrong.Try again"})
    }
}

/*----------------------Customer_Login------------------------*/
exports.adminLogin=async(req,res)=>{

    try{
         
        if(!req.body.email || !req.body.password)
        {
            return res.status(400).send({status:400,Message:"Required input fields cannot be empty"})
        }

        const checkAdmin=await Admin.findOne({email:req.body.email});
        if(!checkAdmin)
        {
            return res.status(400).send({status:400,Message:"Your entered email is not found"})
        }
        else if(checkAdmin)
        {
            const checkPassword=await bcrypt.compare(req.body.password,checkAdmin.password);

            if(!checkPassword)
            {
                return res.status(400).send({status:400,Message:"Your entered password is incorrect"})
            }

            else if(checkPassword && checkAdmin.isAccountBlocked == true)
            {
                return res.status(400).send({status:400,Message:"Your account is blocked.Please contact support team"})
            }
            else if(checkPassword && checkAdmin.isAccountBlocked == false)
            {

                /*--------------TOKEN_GENERATION------------------------*/
                const token= jwt.sign({_id:checkAdmin._id,adminId:checkAdmin.adminId,role:checkAdmin.role},appsConfig.JWT_SECRET_ACCESS_KEY);
                checkAdmin.lastLogintime=Date.now();
                checkAdmin.isLoggedIn=true;
                await checkAdmin.save();
                checkAdmin.token=token;

                //Storing_Activity
                await ActivityRecord.create({adminId:checkAdmin.adminId,activity:"Logged In"});

                
                return res.status(200).send({status:200,Message:"Login success",Data:checkAdmin})
            }
        }
    }
    catch(error)
    {
        res.status(400).send({status:400,Message:error.message || "Something went wrong.Try again"})
    }
}

/*----------------------UPDATE_ADMIN_NAME------------------------*/
exports.updateAdminName=async(req,res)=>{

    try{
        
        if(!req.body.name)
        {
           return res.status(400).send({status:400,Message:"Required name key is missing in the payload request"})
        }
        const adminData=await Admin.findOneAndUpdate({adminId:req.adminId},{$set:{name:req.body.name}},{new:true,upsert:true});
         
                  //Storing_Activity
                  await ActivityRecord.create({adminId:req.adminId,activity:"Update new profile name"});

        return res.status(200).send({status:200,Message:"Name updated successfully",Data:adminData})

    }
    catch(error)
    {
        res.status(400).send({status:400,Message:error.message || "Something went wrong.Try again"})
    }
}

/*----------------------Updating_ProfileImage------------------------*/
exports.updateProfileImage=async(req,res)=>{

    try{

   //Configurations for the s3-bucket
   const s3 = new AWS.S3({
    accessKeyId     :  appsConfig.AWS_ACCESS_KEY_ID,
    secretAccessKey :  appsConfig.AWS_SECRET_ACCESS_KEY,
    region          :  appsConfig.AWS_REGION
      });


     //Params for the s3-Bucket
  const params={
     Bucket: appsConfig.AWS_CUSTOMER_DOCS_BUCKET_NAME,
     Key: req.role+'/'+req.adminId+'/'+Date.now()+req.file.originalname,
     Body: req.file.buffer,
     ContentType: req.file.mimetype,
     ACL:'public-read'
     };   

    //Uploading Image Functionality
    s3.upload(params, async function(s3Err, data) {
     
        if (s3Err) {

           return res.status(400).send({
               status:400,
               Message:s3Err.message || "Unable to upload File.Try again"
           })
        }
        else{ 
          
         const adminProfileImageUrl=appsConfig.AWS_CUSTOMER_DOCS_CDN_URL+'/'+params.Key;

         await Admin.findOneAndUpdate({adminId:req.adminId},{$set:{profileImageUrl:adminProfileImageUrl}},{new:true,upsert:true}).then(async(adminData)=>{

        //Storing_Activity
        await ActivityRecord.create({adminId:req.adminId,activity:"Updated new profile Image"});

            return res.status(200).send({status:200,Message:"profile image updated successfully",Data:adminData})
                                
            }).catch(error=>{
            return res.status(500).send({status:500,Message:error.message || "Something went wrong"})
            })
        }

    })  
    }
    catch(error)
    {
        return res.status(500).send({status:500,Message:error.message || "Something went wrong"})
    }
}


/*------------------------Get_Admin_Profile------------------------*/
exports.getAdminProfile=async(req,res)=>{

    try{
         
        const adminData=await Admin.findOne({adminId:req.adminId});
        const deposits=await CustomerDeposits.find({depositTransactionStatus:"pending"});
        const depositsSum = deposits.map(a => a.depositAmount).reduce((prev, curr) => prev + curr, 0);

        const withdrawls=await CustomerWithdrawls.find({withdrawlTransactionStatus:"pending"});
        const withdrawlsSum = withdrawls.map(a => a.withdrawlAmount).reduce((prev, curr) => prev + curr, 0);

        return res.status(200).send({status:200,Message:"Admin profile fetched successfully",totalDepositsSum:depositsSum,totalWithdrawlsSum:withdrawlsSum,Data:adminData})

    }
    catch(error)
    {
        return res.status(500).send({status:500,Message:error.message || "Something went wrong"})
    }
}

/*------------------------Admin_Logout_Module------------------------*/
exports.adminLogout=async(req,res)=>{

    try{
         
        const adminData=await Admin.findOneAndUpdate({adminId:req.adminId},{$set:{isLoggedIn:false},$unset:{token:req.admin.token}},{new:true});

        //Storing_Activity
        await ActivityRecord.create({adminId:req.adminId,activity:"Logged out"});

        return res.status(200).send({status:200,Message:"Logout successfully"})

    }
    catch(error)
    {
        return res.status(500).send({status:500,Message:error.message || "Something went wrong"})
    }
}


/*-------------------Fetching_Super_Admin_Activity_Api-----------*/
exports.getSuperAdminActivity=async(req,res)=>{

    try{
          
        const activityData=await ActivityRecord.find({}).sort('-createdAt').select('-adminId -updatedAt');

        return res.status(200).send({status:200,Message:`Fetched ${activityData.length} records`,Data:activityData})


    }
    catch(error)
    {
        return res.status(500).send({status:500,Message:error.message || "Something went wrong"})
    }
}