const appsConfig=require('../../constants/appConstants.json');
const customerModels=require('../../models/customer/customerModels');
const ActivityRecord=require('../../models/superadmin/activityRecord');
const FundsHistory=require('../../models/superadmin/fundsHistory');
const CustomerDeposits=require('../../models/customer/customerDeposits');
const CustomerWithdrawls=require('../../models/customer/customerWithdrawls');
const Customer=require('../../models/customer/customer')


/*-------------------------Getting_all_Customers_Module--------------------*/
exports.getAllCustomers=async(req,res)=>{

    try{

        const customersData=await Customer.aggregate([

            {
                $match:{

                    isAccountBlocked
                    :
                    false,
                    isEmailVerified
                    :
                    true,
                    isMobileNumberVerified
                    :
                    true,
                    isBankDetailsUpdated
                    :
                    true
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
                    nickname:1,
                    _id:1
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
       
        const data=await Customer.updateMany({customerId:{$in:req.body.customerId}},{$set:{isAccountBlocked:true}});
        
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
       
        const unblockedCustomersData=await Customer.updateMany({customerId:{$in:req.body.customerId}},{$set:{isAccountBlocked:false}});

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

        const customersData=await Customer.aggregate([

            {
                $match:{

                     isAccountBlocked
                    :
                    true,
                    isEmailVerified
                    :
                    true,
                    isMobileNumberVerified
                    :
                    true,
                    isBankDetailsUpdated
                    :
                    true
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
    
        const customerData=await Customer.findOneAndUpdate({customerId:req.body.customerId},{$set:{userState:req.body.userState}},{new:true});

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

        const deletedCustomerData=await Customer.deleteMany({customerId:{$in:req.body.customerId}});

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


/*---------------Get_CustomerById-----------------------*/
exports.getCustomer=async(req,res)=>{

    try{
 
        if(!req.body.customerId)
        {
            return res.status(400).send({status:400,Message:"Required customerId fields cannot be empty"})
        }

        const checkCustomerId=await Customer.findOne({customerId:req.body.customerId});

        if(!checkCustomerId)
        {
            return res.status(400).send({status:400,Message:"Your provided customerid is invalid"});
    
        }

        const customerData=await Customer.aggregate([

            {
                $match:{
                    customerId:req.body.customerId
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
                    managerName:"$adminData.name",
                    adminId:"$adminData.adminId"
                }
            },
            {
                $project:
                {
                    _id:1,
                    walletBalance:1,
                    customerId:1,
                    adminId:1,
                    managerName:1,
                    email:1,
                    mobileNumber:1,
                    totalDepositsAmount:1,
                    totalWithdrawlsAmount:1,
                    totalRevenueAmount:1,
                    userBankAccountHolderName:1,
                    userBankAccountNumber:1,
                    userBankName:1,
                    username:1,
                    nickname:1,
                    bankDetailsUpdatedAt:1,
                    createdAt:1,
                    note:1
                }
            }
        ]);

        res.status(200).send({status:200,Message:"User fetched successfully",Data:customerData})
        
    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}


//EditNote
exports.editCustomerNote=async(req,res)=>{

    try{
      
        if(!req.body.customerId || !req.body.note)
        {
            return res.status(400).send({status:400,Message:"Required customerId or note fields cannot be empty"})
        }

        const checkUser=await Customer.findOne({customerId:req.body.customerId});

        if(!checkUser)
        {
            return res.status(400).send({status:400,Message:"Your entered customerId is invalid"})
        }

        const noteData=await Customer.findOneAndUpdate({customerId:req.body.customerId},{$set:{note:req.body.note}},{new:true});
        return res.status(400).send({status:200,Message:"Note submitted successfully",noteData:noteData.note})


    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}

//Transfer Balance
exports.transferMoneyToUsers=async(req,res)=>{

    try{
      
        if(!req.body.customerId || !req.body.amount)
        {
            return res.status(400).send({status:400,Message:"Required customerId or amount fields cannot be empty"})
        }

        const checkUser=await Customer.findOne({customerId:req.body.customerId});

        if(!checkUser)
        {
            return res.status(400).send({status:400,Message:"Your entered customerId is invalid"})
        }
         
        await FundsHistory.create({adminId:req.id,customerId:checkUser._id,amount:req.body.amount,fundType:2});
        const customerData=await Customer.findOneAndUpdate({customerId:req.body.customerId},{$inc:{walletBalance:req.body.amount}},{new:true});

        return res.status(200).send({status:200,Message:"Funds transferred successfully",Data:customerData})

        
    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}

//Transfer Balance
exports.deductMoneyFromUsers=async(req,res)=>{

    try{
      
        if(!req.body.customerId || !req.body.amount)
        {
            return res.status(400).send({status:400,Message:"Required customerId or amount fields cannot be empty"})
        }

        const checkUser=await Customer.findOne({customerId:req.body.customerId});

        if(!checkUser)
        {
            return res.status(400).send({status:400,Message:"Your entered customerId is invalid"})
        }
         
        else if(checkUser && checkUser.walletBalance < req.body.amount)
        {
            return res.status(400).send({status:400,Message:"Your entered amount is greater than customer wallet balance"})
        }
        else if(checkUser && checkUser.walletBalance >=req.body.amount )
        {

        await FundsHistory.create({adminId:req.id,customerId:checkUser._id,amount:req.body.amount,fundType:1});
        const customerData=await Customer.findOneAndUpdate({customerId:req.body.customerId},{$inc:{walletBalance:-(req.body.amount)}},{new:true});

        return res.status(200).send({status:200,Message:"Funds deducted successfully",Data:customerData})

        }
        
    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}


//Deposit statements of customers
exports.getCustomerActivity=async(req,res)=>{

    try{

        if(!req.body.id || !req.body.activityType)
        {
            return res.status(400).send({status:400,Message:"Required customerId or activityType fields cannot be empty"})
        }
        
       
        const type=(req.body.activityType).toLowerCase();

        const checkCustomer=await Customer.findOne({_id:req.body.id});
        if(!checkCustomer)
        {
            return res.status(400).send({status:400,Message:"Your entered customerId is invalid"})
        }

        let DBQuery;
        if(type=="customerdeposits")
        {
          DBQuery=await CustomerDeposits.find({customerId:req.body.id}).populate("depositApprovedOrRejectedBy", "_id name adminId");
        }

        else if(type == "customerwithdrawls")
        {
            DBQuery=await CustomerWithdrawls.find({customerId:req.body.id}).populate("withdrawlApprovedOrRejectedBy","_id name adminId");
        }
        console.log("ModelName",DBQuery)

        const data= DBQuery;

        return res.status(200).send({status:200,Message:" Data fetched successfully",totalCount:data.length,Data:data})

    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}

