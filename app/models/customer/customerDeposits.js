const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerDepositsSchema=new Schema({

    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"customers"
    },
    depositAmount:{
        type:Number
    },
    depositTransactionType:{
        type:String
    },
    depositTransactionTypeImage:{
        type:String
    },
    depositId:{
        type:String,
        unqiue:true,
        sparse:true,
        index:true
    },
    depositTransactionStatus:{
        type:String,
        default:"pending"
    },
    depositTransactionNumber:{
        type:String,
        unique:true,
        sparse:true,
        index:true
    },
    customerDepositProof:{
        type:String
    },
    depositApprovedOrRejectedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admin"
    },
    depositApprovedOrRejectedAt:{
        type:Date
    },
    depositorMobileNumber:{
        type:Number
    },
    depositorCountryCode:{
        type:Number
    },
    depositorBankAccountHolderName:{
        type:String
    },
    depositorBankAccountNumber:{
        type:String
    },
    depositorBankName:{
        type:String
    },
    depositorEmail:{
        type:String
    }

},{timestamps:true,versionKey:false});
const CustomerDeposits=new mongoose.model('customer_deposits',customerDepositsSchema);

module.exports=CustomerDeposits;