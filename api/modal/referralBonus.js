const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const User = require('./user');
const Order = require('./order');

const Referralbonus = new mongoose.Schema({
	from		:	{type:String},
	to			:	{type:String},
	createdAt	:	{type:String},
	fromUser 	:	{ type: mongoose.Schema.ObjectId, ref: 'User'},
	toUser 		:	{ type: mongoose.Schema.ObjectId, ref: 'User'},
	order 		:	{ type: mongoose.Schema.ObjectId, ref:'Order',default:null},
	amount 		: 	{ type: Number},
	level		:	{type:String}
});

var referralBonus = mongoose.model('referralBonus', Referralbonus);
module.exports = referralBonus;
