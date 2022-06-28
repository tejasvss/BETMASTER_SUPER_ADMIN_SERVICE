const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        index: true,
        sparse: true,
        trim: true
    },
    adminId:{
        type:String,
        unique:true,
        sparse:true,
        index:true
    },
    email: {
        type: String, lowercase: true, index: true, unique: true,sparse:true
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    isAccountBlocked:{
        type:Boolean,
        default:false
    },
    accessAreas:[{
        type:String,
        lowercase:true,
        trim:true
    }],
    password: {
        type: String
    },
    countryCode:{
        type:Number
    },
    mobileNumber: {
        type: Number,
        unique: true,
        index: true,
        sparse: true
    },
    role:{
        type: String,
        lowercase:true
    },
    walletBalance: {
        type: Number,
        default: 0
    },
    
    userManagement: {
        type: Boolean,
    },
    fundManagement: {
        type: Boolean,
    },
    token: {
        type: String
    },
    lastLoginTime: {
        type: Date
    },
    adminsCount:{
        type:Number
    },
    usersCount:{
        type:Number,
        default:0
    },
    profileImageUrl:{
        type:String
    },
    isLoggedIn:{
        type:Boolean
    },
    usersHoldingAmount:{
        type:Number
    },
    settlementAmount:{
        type:Number
    }
},{timestamps:true,versionKey:false});

//Hiding Details
adminSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.lastLoginTime;
    return userObject;

}

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;