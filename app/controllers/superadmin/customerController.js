const appsConfig=require('../../constants/appConstants.json');
const customerModels=require('../../models/customer/customerModels');
const ActivityRecord=require('../../models/superadmin/activityRecord');



/*-------------------------Getting_all_Customers_Module--------------------*/
exports.getAllCustomers=async(req,res)=>{

    try{

        const customersData=await customerModels.Customer.aggregate([

            {
                $match:{

                    customerStatusId:3
                }
            },
            {
                $lookup:
                {
                    from:"referralcodes",
                    localField:"referralCode",
                    foreignField:"referralCode",
                    as:"refData"
                }
            },
            {
                $unwind:"$refData"
            },
            {
               $lookup:
               {
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
                  managerName:"$adminData.name"
                }
            },
            {
                $project:
                {
                    customerId:1,
                    username:1,
                    walletBalance:1,
                    managerName:1,
                    createdAt:1,
                    totalDepositsAmount:1,
                    totalWithdrawlsAmount:1,
                    totalRevenueAmount:1,
                    userState:1,
                    nickname:1
                }
            }
        ]);

        res.status(200).send({status:200,Message:"User data fetched successfuly",totalCustomersCount:customersData.length,Data:customersData})

    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}

/*----------------------BLOCK_CUSTOMER_API---------------------*/
exports.blockCustomer=async(req,res)=>{

    try{

        if(!req.body.customerId)
        {
            return res.status(400).send({status:400,Message:"Required customerId fields cannot be empty"})
        }

        console.log("Length",(req.body.customerId).length)
       
        const data=await customerModels.Customer.updateMany({customerId:{$in:req.body.customerId}},{$set:{customerStatusId:4,isAccountBlocked:true}});
        
        //Storing_Activity
        await ActivityRecord.create({adminId:req.adminId,activity:`Blocked ${(req.body.customerId).length} customers`});

        res.status(200).send({status:200,Message:"Accounts blocked sucessfully"})

    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}

/*----------------------Un_BLOCK_CUSTOMER_API---------------------*/
exports.unBlockCustomer=async(req,res)=>{

    try{

        if(!req.body.customerId)
        {
            return res.status(400).send({status:400,Message:"Required customerId fields cannot be empty"})
        }
       
        const unblockedCustomersData=await customerModels.Customer.updateMany({customerId:{$in:req.body.customerId}},{$set:{customerStatusId:3,isAccountBlocked:false}});

        //Storing_Activity
        await ActivityRecord.create({adminId:req.adminId,activity:`Unblocked ${(req.body.customerId).length} customers`});

        res.status(200).send({status:200,Message:"Accounts unblocked sucessfully"})

    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}

/*-------------------------Getting_all_Customers_Module--------------------*/
exports.getAllBlockedCustomers=async(req,res)=>{

    try{

        const customersData=await customerModels.Customer.aggregate([

            {
                $match:{

                    customerStatusId:4
                }
            },
            {
                $lookup:
                {
                    from:"referralcodes",
                    localField:"referralCode",
                    foreignField:"referralCode",
                    as:"refData"
                }
            },
            {
                $unwind:"$refData"
            },
            {
               $lookup:
               {
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
                  managerName:"$adminData.name"
                }
            },
            {
                $project:
                {
                    customerId:1,
                    username:1,
                    walletBalance:1,
                    managerName:1,
                    createdAt:1,
                    totalDepositsAmount:1,
                    totalWithdrawlsAmount:1,
                    totalRevenueAmount:1,
                    userState:1,
                    nickname:1
                }
            }
        ]);

        res.status(200).send({status:200,Message:"User data fetched successfuly",totalBlockedCustomersCount:customersData.length,Data:customersData})

    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}

/*------------------------Change_Customer_State--------------------*/
exports.changeCustomerState=async(req,res)=>{

    try{

        if(!req.body.customerId || !req.body.userState)
        {
            return res.status(400).send({status:400,Message:"Required customerId or userState fields cannot be empty"})
        }
    
        const customerData=await customerModels.Customer.findOneAndUpdate({customerId:req.body.customerId},{$set:{userState:req.body.userState}},{new:true});

                //Storing_Activity
                await ActivityRecord.create({adminId:req.adminId,activity:`Changes customerstate to ${req.body.userState}`});

        res.status(200).send({status:200,Message:"User state changed successfully",Data:customerData})

    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}

/*------------------------Change_Customer_State--------------------*/
exports.deleteCustomer=async(req,res)=>{

    try{
         
        if(!req.body.customerId)
        {
            return res.status(400).send({status:400,Message:"Required customerId fields cannot be empty"})
        }

        const deletedCustomerData=await customerModels.Customer.deleteMany({customerId:{$in:req.body.customerId}});

        return res.status(200).send({status:200,Message:"Customers deleted successfully"})
    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}

/*----------------Customer_Error_Logs------------*/
exports.getCustomerErrorLogs=async(req,res)=>{

    try{

        const logsData=await customerModels.CustomerErrorLogs.find({}).sort('-createdAt');
        return res.status(200).send({status:200,Message:"Logs fetched successfully",logsCount:logsData.length,Data:logsData})
    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}