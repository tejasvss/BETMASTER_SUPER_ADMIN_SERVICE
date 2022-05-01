const mongoose = require('mongoose');

const activityRecordSchema = new mongoose.Schema({

    adminId:{
        type:String
    },
    activity:{
        type:String
    }

},{timestamps:true,versionKey:false});

const ActivityRecord=new mongoose.model("admin_activity_records",activityRecordSchema);

module.exports=ActivityRecord;