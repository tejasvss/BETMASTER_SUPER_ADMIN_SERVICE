const Admin=require('../../models/superadmin/admin');
const generateId=require('../../utils/helpers/generateId');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const appsConfig=require('../../constants/appConstants.json');



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

                
                return res.status(200).send({status:200,Message:"Login success",Data:checkAdmin})
            }
        }
    }
    catch(error)
    {
        res.status(400).send({status:400,Message:error.message || "Something went wrong.Try again"})
    }
}
