const Admin=require('../../models/superadmin/admin');
const bcrypt=require('bcryptjs');
const generateId=require('../../utils/helpers/generateId');


//Create Manager

exports.createManager=async(req,res)=>{

    try{
        
        if(!req.body.name || !req.body.adminId || !req.body.email || !req.body.mobileNumber || !req.body.password || !req.body.role)
        {
            return res.status(400).send({status:400,Message:"Required keys are missing in the payload request"})
        }
        const checkAdminId=await Admin.findOne({adminId:req.body.adminId})
        if(checkAdminId)
        {
            return res.status(400).send({status:400,Message:"Your entered adminId is already taken.Try another adminId"})
        }
        const checkEmail=await Admin.findOne({email:req.body.email});
        if(checkEmail)
        {
            return res.status(400).send({status:400,Message:"Your entered email is already taken.Try another email"})
        }
        const checkMobileNumber=await Admin.findOne({mobileNumber:req.body.mobileNumber});
        if(checkMobileNumber)
        {
            return res.status(400).send({status:400,Message:"Your entered mobilenumber is already taken.Try another mobilenumber"})
        }

        const password=await bcrypt.hash(req.body.password,8);
        const managersData=await Admin.create({email:req.body.email,mobileNumber:req.body.mobileNumber,countryCode:req.body.countryCode,
                                               name:req.body.name,adminId:req.body.adminId,role:req.body.role,password:password,accessAreas:req.body.accessAreas});

        res.status(200).send({status:200,Message:"Your admin created successfully",Data:managersData})
                                       
    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}


//GetLatestManagers
exports.getLatestManagers=async(req,res)=>{

    try{

        const managersData=await Admin.find({$or:[{role:"marketingmanager"},{role:"operationmanager"}]}).sort('-createdAt');
        res.status(200).send({status:200,Message:"Managers Data fetched successfully",Data:managersData})

    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}