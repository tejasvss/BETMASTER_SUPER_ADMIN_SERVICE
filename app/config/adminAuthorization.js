const Admin=require('../models/superadmin/admin');
const appsConfig=require('../constants/appConstants.json');
const jwt=require('jsonwebtoken')

//Verification setup for the provided token
exports.verifyToken = async(req, res, next) => {

    try{

    let token = req.header('Authorization').replace('Bearer ', '');

    if (!token ) {
        return res.status(403).send({
            status:403,
            message: "No token provided!"
        });
    }

    //Decoding the provided token
    const decoded=jwt.verify(token,appsConfig.JWT_SECRET_ACCESS_KEY);

    //Finding the user in user's collections
    const admin=await Admin.findOne({_id:decoded._id })
        if (!admin) {
            return res.status(401).send({
                status: 401,
                Message: "Unauthorized User or User not found for provided token!"
            });
        }
        req.admin=admin;
        req.role=admin.role;
        req.adminId=admin.adminId;
        req.id = admin._id;
         
        next();
    }
    catch(err)
    {

        res.status(500).send({
            status:500,
            Message:err.message || "Session timed out.Try login again "
        })
    }
    
};


exports.isSuperAdmin=async(req,res,next)=>{

    if (req.role.toLowerCase() === "superadmin") {
        next();
        return;
    }
    res.status(400).send({
        status: 400,
        message: "Access denied. Require superadmin Role!"
    });
    return;
}