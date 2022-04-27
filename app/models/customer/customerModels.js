const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customer = new Schema({}, { strict: false });
exports.UserCollection = mongoose.model('customers', Customer);

const customerDeposits=new Schema({},{strict:false});
exports.CustomerDeposits=mongoose.model('customer_deposits',customerDeposits);

const customerWithdrawls=new Schema({},{strict:false});
exports.CustomerWithdrawls=mongoose.model('customer_withdrawls',customerWithdrawls);

const customerReports=new Schema({},{strict:false});
exports.CustomerReports=mongoose.model('customer_reports',customerReports);

