const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerReports=new Schema({},{timestamps:true});
exports.CustomerReports=mongoose.model('customer_reports',customerReports);

const CustomerErrorLogs=new Schema({},{timestamps:true});
exports.CustomerErrorLogs=mongoose.model("customer_error_logs",CustomerErrorLogs);

