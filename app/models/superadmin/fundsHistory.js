const mongoose = require('mongoose');

const fundsHistorySchema = new mongoose.Schema({

    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"admins"
    },
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"customers"
    },
    amount:{
        type:Number
    },
    fundType:{
        type:Number               /*If fundtype=2 -- Funds transfered from admin to customer
                                       fundtype=1 -- Funds transfered from customer to admin */
    }

},{timestamps:true,versionKey:false});

const FundsHistory=new mongoose.model("funds_history",fundsHistorySchema);

module.exports=FundsHistory;