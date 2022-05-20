const {Customer,CustomerDeposits,CustomerWithdrawls}=require('../../models/customer/customerModels');
const Admin=require('../../models/superadmin/admin');
const ActivityRecord=require('../../models/superadmin/activityRecord');

var isodate = require("isodate");
/*------------------today_Statistics_Module---------------*/
exports.getstatistics=async(req,res)=>{

    try{


        const deposits=await CustomerDeposits.find({depositTransactionStatus:"pending",createdAt:{$gte:new Date(Date.now()).setHours(00,00,00),$lt:new Date(Date.now()).setHours(23,59,59)}});
        const depositsSum = deposits.map(a => a.depositAmount).reduce((prev, curr) => prev + curr, 0);

        const withdrawls=await CustomerWithdrawls.find({withdrawlTransactionStatus:"pending",createdAt:{$gte:new Date(Date.now()).setHours(00,00,00),$lt:new Date(Date.now()).setHours(23,59,59)}});
        const withdrawlsSum = withdrawls.map(a => a.withdrawlAmount).reduce((prev, curr) => prev + curr, 0);

        const userWallet=await Customer.find({customerStatusId:3,createdAt:{$gte:new Date(Date.now()).setHours(00,00,00),$lt:new Date(Date.now()).setHours(23,59,59)}});
        const walletBalanceSum=userWallet.map(a=>a.walletBalance).reduce((prev, curr) => prev + curr, 0);

        const newUsers=await Customer.find({$or:[{customerStatusId:1},{customerStatusId:2},{customerStatusId:3}],createdAt:{$gte:new Date(Date.now()).setHours(00,00,00),$lt:new Date(Date.now()).setHours(23,59,59)}}).countDocuments();
        console.log("New users",newUsers);
       
        res.status(200).send({status:200,Message:"Statistics fetched successfuly",
                             Data:{
                             onlineUsersCount:3,
                             totalNewUsers:newUsers,
                             totalDeposits:depositsSum,
                             totalWithdrawls:withdrawlsSum,
                             totalWalletBalanceSum:walletBalanceSum,
                             totalProfit:0
                             }})

    }
    catch(error)
    {
       
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}

/*----------------------get_Dashboard_Module------------------*/
exports.getDashboard=async(Req,res)=>{

    try{
        const usersCount=await Customer.find({isEmailVerified:true,isMobileNumberVerified:true,isBankDetailsUpdated:true,isAccountBlocked:false}).countDocuments();
        const blockeUsersCount=await Customer.find({isAccountBlocked:true}).countDocuments();
        const managersCount=await Admin.find({role:"manager"}).countDocuments();
        

        res.status(200).send({status:200,Message:"Dashboard data fetched successfully",
                              Data:{
                                  totalUsersCount:usersCount,
                                  totalActiveUsersCount:usersCount,
                                  totalInactiveUsersCount:0,
                                  totalBlockeUsersCount:blockeUsersCount,
                                  totalManagersCount:managersCount,
                                  totalNewManagersCount:managersCount,
                                  totalActiveManagersCount:managersCount,
                                  totalInactiveManagersCount:0
                              }})


    }
    catch(error)
    {
        res.status(500).send({status:500,Message:error.message || "Something went wrong.Try again"})
    }
}