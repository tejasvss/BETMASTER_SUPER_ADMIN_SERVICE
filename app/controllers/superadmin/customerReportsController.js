const Admin=require('../../models/superadmin/admin');
const generateId=require('../../utils/helpers/generateId');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const appsConfig=require('../../constants/appConstants.json');
const customerModels=require('../../models/customer/customerModels');
const ActivityRecord=require('../../models/superadmin/activityRecord');



/*----------------Getting_All_Customer_Reports---------------------*/
exports.getAllCustomerReports=async(req,res)=>{

    try{
       
        const reportsData=await customerModels.CustomerReports.aggregate([

            {
                $lookup:{
                    from:"customers",
                    localField:"customerId",
                    foreignField:"customerId",
                    as:"userData"
                }
            },
            {
                $unwind:"$userData"
            },
            {
                $lookup:{
                    from:"referralcodes",
                    localField:"userData.referralCode",
                    foreignField:"referralCode",
                    as:"refData"
                }
            }, 
            {
                $unwind:"$refData"
            },
            {
                $lookup:{
                    from:"admins",
                    localField:"refData.adminId",
                    foreignField:"adminId",
                    as:"adminData"
                }
            },
            {
                $unwind:"$adminData"
            },
            {
                $addFields:
                {
                    managerName:"$adminData.name",
                    username:"$userData.username"
                }
            },
            {
                $project:  {
                    _id: 1,
                    customerId:1,
                    username:1,
                    reportId:1,
                    complaint: 1,
                    reportStatus:1,
                    isEditable:1,
                    isReplied: 1,
                    managerName:1
                }
            }
        ])
        res.status(200).send({status:200,Message:"Reports fetched successfully",Data:reportsData})

    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}

/*----------------------Change_report_Status------------------------------*/
exports.changeReportStatus=async(req,res)=>{

    try{
         
        if(!req.body.reportStatus || !req.body.reportId)
        {
            return res.status(400).send({status:400,Message:"Required reportsStatus or reportId fields cannot be empty"})
        }

        const checkReportId=await customerModels.CustomerReports.findOne({reportId:req.body.reportId});
        if(!checkReportId)
        {
            return res.status(400).send({status:400,Message:"Your entered reportId is invalid"})
        }
        else if(checkReportId)
        {
            const reportData=await customerModels.CustomerReports.findOneAndUpdate({reportId:req.body.reportId},{$set:{reportStatus:req.body.reportStatus,isEditable:false}},{new:true});
            res.status(200).send({status:200,Message:"Reports fetched successfully",Data:reportData})

        }
    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}

/*----------------------Reply_To_Report------------------------------*/
exports.replyToReport=async(req,res)=>{

    try{
         
        if(!req.body.reportId || !req.body.reply)
        {
            return res.status(400).send({status:400,Message:"Required reply or reportId fields cannot be empty"})
        }

        const checkReportId=await customerModels.CustomerReports.findOne({reportId:req.body.reportId});
        if(!checkReportId)
        {
            return res.status(400).send({status:400,Message:"Your entered reportId is invalid"})
        }
        else if(checkReportId)
        {
            const replyData=await customerModels.CustomerReports.findOneAndUpdate({reportId:req.body.reportId},{$set:{reply:req.body.reply,isReplied:true,isEditable:false,repliedBy:req.id,repliedAdminName:req.admin.name}},{new:true,upsert:true});

            //Storing_Activity
            await ActivityRecord.create({adminId:req.adminId,activity:"Replied to report"});
            res.status(200).send({status:200,Message:"Reply submitted successfully",Data:replyData})

        }
    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}

/*----------------Getting_Report_By_ReportId---------------------*/
exports.getCustomerReportByReportId=async(req,res)=>{

    try{

        const checkReportId=await customerModels.CustomerReports.findOne({reportId:req.params.reportId})
        if(!checkReportId)
        {
            return res.status(400).send({status:200,Message:"Your entered reportId is invalid"})
        }
       
        const reportsData=await customerModels.CustomerReports.aggregate([

            {
                $match:{
                    reportId:req.params.reportId
                }
            },

            {
                $lookup:{
                    from:"customers",
                    localField:"customerId",
                    foreignField:"customerId",
                    as:"userData"
                }
            },
            {
                $unwind:"$userData"
            },
            {
                $lookup:{
                    from:"referralcodes",
                    localField:"userData.referralCode",
                    foreignField:"referralCode",
                    as:"refData"
                }
            }, 
            {
                $unwind:"$refData"
            },
            {
                $lookup:{
                    from:"admins",
                    localField:"refData.adminId",
                    foreignField:"adminId",
                    as:"managerData"
                }
            },
            {
                $unwind:"$managerData"
            },
            {
                $addFields:
                {
                    managerName:"$managerData.name",
                    username:"$managerData.username"
                }
            },
            {
                $project:  {
                    _id: 1,
                    customerId:1,
                    reply:1,
                    username:1,
                    reportId:1,
                    complaint: 1,
                    reportStatus:1,
                    isEditable:1,
                    isReplied: 1,
                    managerName:1,
                    repliedAdminName:1
                }
            }
        ])
        res.status(200).send({status:200,Message:"Reports fetched successfully",Data:reportsData})

    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}