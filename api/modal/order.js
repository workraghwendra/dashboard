const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const User = require('./user');

const orderSchema = new mongoose.Schema({
	
	Merchant_orderId:{type:String},
	time_created	:	{type:Number},
	time_expires	:	{type:Number,default:null},
	status			:	{type:Number,default:100},
	type			:	{type:String,default:'USD'},
	exValue			:	{type:Number},
	amountf			:	{type:Number},
	receivedf		:	{type:String},
	recv_confirms	:	{type:Number,default:100},
	txn_id			:	{type:String},
	payment_address	:	{type:String},
	qrcode_url		:	{type:String,default:null},
	enm		:	{type:Number},
	usd:{type:Number,default:0},
	order_id		:	{type:String},
	user 			:	{ type: mongoose.Schema.ObjectId, ref: 'User' },
});

var order = mongoose.model('order', orderSchema);
module.exports = order;
