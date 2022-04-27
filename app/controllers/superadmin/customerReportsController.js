const Admin=require('../../models/superadmin/admin');
const generateId=require('../../utils/helpers/generateId');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const appsConfig=require('../../constants/appConstants.json');
const customerModels=require('../../models/customer/customerModels');


/*----------------Getting_All_Customer_Reports---------------------*/
exports.getAllCustomerReports=async(req,res)=>{

    try{
       
        const reportsData=await customerModels.CustomerReports.find({});
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
            const replyData=await customerModels.CustomerReports.findOneAndUpdate({reportId:req.body.reportId},{$set:{reply:req.body.reply,isReplied:true,isEditable:false}},{new:true});
            res.status(200).send({status:200,Message:"Reply submitted successfully",Data:replyData})

        }
    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}