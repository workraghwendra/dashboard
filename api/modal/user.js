const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const jwt = require('jsonwebtoken');
require('./order');
require('./referralBonus');

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = '3zTvzr3p67VC61';
const userSchema = new mongoose.Schema({
		email: {
				type: String,
				unique: true,
				trim: true,
				required: true
		},
		name: {
				type: String,
				trim: true,
				required: true
		},
		status: {
			activeEmailToken: { type: String },
			activeEmailTokenExp: {type: Date },
			resetPassToken:	{ type: String ,default: null},
			resetPassExp: { type: Date ,default: null},
			activTempEmail: { type: String ,default: null},
			otp	:{ type: String ,default: null},
			active:{type: Boolean,default:false},
			tfa:{type:Boolean,default: false},
			activetfaOtp:{ type: String },
			type: {type:Number,default:2},
			banned:{type:Boolean, default:false} // 0 superuser,1 users
		},
		//country:{type:String, required:true,trim:true},
		avatar: { type: String , default: null},
		referral: [{}],
		// referral2: { type: String , default: null},
		// referral3: { type: String , default: null},
		// referral4: { type: String , default: null},
		
		usdspend:{type:String,default:0},
		refGenId:{type:String,default:null},
		btcspend:{type:String,default:0},
		ethspend:{type:String,default:0},
		totalToken: { type:Number  , default: 0},
		purchasedcoins: { type:Number  , default: 0},
		referredcoins: { type:Number  , default: 0},		
		referralBonus: [{type: mongoose.Schema.ObjectId, ref: 'referralBonus'}],
		orders: [{type: mongoose.Schema.ObjectId, ref: 'order'}],
		phone: {
			countryCode:String,
			country:String,
			number:{type:Number, trim:true},
		},
		created:{type: Date, default: Date.now},
		password: String,
		jwtToken:[{}]
		//referenceid:{ type:String,trim:true}
});

userSchema.methods.encrypt = function(text) {
	var cipher = crypto.createCipher(algorithm,password)
	var crypted = cipher.update(text,'utf8','hex')
	crypted += cipher.final('hex');
	this.password = crypted;
};

userSchema.methods.decrypt = function (text) {
	var decipher = crypto.createDecipher(algorithm,password)
	var dec = decipher.update(text,'hex','utf8')
	dec += decipher.final('utf8');
	return dec;
};



userSchema.methods.generateJwt = function () {
		return jwt.sign({
			_id     		: this._id,
			email   		: this.email,
			name    		: this.name,
			phone   		: {countryCode:this.phone.countryCode,country:this.phone.country,number:this.phone.number},
			status  		: this.status.active,
			referral		: this.referral,
			created 		: this.created,
			exp     		: parseInt((Date.now()+3600000)/1000)
		}, process.env.JWT_SECRET);
};

var user = mongoose.model('user', userSchema);
module.exports = user;
