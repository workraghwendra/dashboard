var express = require('express');
var router = express.Router();
var UserController = require("../api/controller/user");
var jwt = require('jsonwebtoken');
var fetch =require("../api/controller/admin");
var fetchd =require("../api/controller/admindashboard");
var fetchrefree =require("../api/controller/admin");
var fetchuser =require("../api/controller/userdetail");
var updatestatus=require("../api/controller/updatestatus")
var distribute =require("../api/controller/admin");
var addreferral =require("../api/controller/admin");
var AdminController=require("../api/controller/admin");
var fetchactiveuser=require("../api/controller/admindashboard");
var fetchinactiveuser=require("../api/controller/admindashboard");
var fetchalluser=require("../api/controller/admindashboard")
var fetchtotalsoldtoken=require("../api/controller/admindashboard");
var fetchtotaltoken=require("../api/controller/admindashboard")
var fetchreferredtoken=require("../api/controller/admindashboard")
var fetchlast=require("../api/controller/admindashboard")
var fetch24=require("../api/controller/admindashboard")
var fetchlast1=require("../api/controller/admindashboard")
var fetchlast2=require("../api/controller/admindashboard")
var fetchlast3=require("../api/controller/admindashboard")
var fetchlast4=require("../api/controller/admindashboard")
var fetchlast5=require("../api/controller/admindashboard")
var fetchlast6=require("../api/controller/admindashboard")
var fetchadmintoken=require("../api/controller/admindashboard")
var User = require('../api/modal/user')
var validator=require('express-validator')
/* GET users listing. */


router.use(validator());



var verifyToken = function(req,res,next){
	var token = ""
//	console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@",req.headers)
	if (req.headers.authorization){
		//console.log(req.headers.cookie)
	 	if(req.headers.authorization.split(' ')[0] === 'Bearer') {
        	token = req.headers.authorization.split(' ')[1];
	 	}else{
	 		token = null
	 	}
    } else if (req.cookies.Auth ||req.query && req.query.token) {
       	token  = req.cookies.Auth;
    }

	if(token){
	//	console.log(token)
		jwt.verify(token, process.env.JWT_SECRET, function(err,decoded){
			if(err){
				if(err.message =="jwt expired"){
					return res.json({status:false, mess:'token expired.'});
				}
				return res.json({status:false, mess:'You are not authenticate person.'});
			} else {
				User.findOne({_id: decoded._id}).then(function(res){
					if(!res || res=='')return res.send({ status: false, mess: 'User not found.'});
					if(res){
						req.user_data = res;
						return next();
					}else{
						return res.send({ status: false, mess: 'User not found OR Some error has been occured.'});
					}
				}).catch(function(err){
						return res.send({ status: false, mess: 'wrong'});
				});
			}
		});
	} else {
		return res.status(403).send({
			status: false,
			mess: 'No token provided.'
		});
	}
};




var verifyAdmin = function(req,res,next){
	if (req.headers.authorization){
	 	if(req.headers.authorization.split(' ')[0] === 'Bearer') {
        	token = req.headers.authorization.split(' ')[1];
	 	}else{
	 		token = null
	 	}
    } else if (req.cookies.Admin ||req.query && req.query.token) {
		   token  = req.cookies.Admin;
    }

	if(token){
		jwt.verify(token, process.env.JWT_SECRET, function(err,decoded){
			if(err){
				if(err.message =="jwt expired"){
					return res.json({status:false, mess:'token expired.'});
				}
				return res.json({status:false, mess:'You are not authenticate person.'});
			} else {
				User.findOne({_id: decoded._id}).then(function(res){
					if(!res || res=='')return res.send({ status: false, mess: 'Admin not found.'});
					if(res){
						req.user_data = res;
						return next();
					}else{
						return res.send({ status: false, mess: 'Admin not found OR Some error has been occured.'});
					}
				}).catch(function(err){
						return res.send({ status: false, mess: 'wrong'});
				});
			}
		});
	} else {
		return res.status(403).send({
			status: false,
			mess: 'No token provided.'
		});
	}
};
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/register',UserController.RegisterUser);
router.get('/activate/:token',UserController.verifyActivation);
router.post('/login',UserController.Login);
router.post('/getEmailActivationLink',UserController.getEmailActivationLink)
router.post('/getForPassLink',UserController.getForPassLink);
router.get('/verifyForPassLink/:token/:otp',UserController.verifyForPassLink);
router.post('/saveNewPassword/',UserController.saveNewPassword);
router.post('/purchaseCurr',verifyToken,UserController.purchaseCurr);
router.get('/fetchOrHis',verifyToken,UserController.fetchOrHis)
router.post('/editBasicInfo',verifyToken,UserController.editBasicInfo)
router.post('/canOrd',verifyToken,UserController.canOrd);
router.post('/chaPass',verifyToken,UserController.changPass);
router.post('/ipn_handler',UserController.autoipnMethod);
// router.get('/admindetails',verifyToken,UserController.tokenSold);
router.get('/refList',verifyToken,UserController.referralBonusList);
// router.get('/admindetails',verifyToken,UserController.tokenSold);
router.get('/admindetails',verifyToken,UserController.tokenSold);
router.post('/tfa', verifyToken, UserController.tfa);
router.post('/tfaemail', UserController.tfaemail);
router.post('/tfaverify', UserController.tfaverify);

router.get('/fetch',fetch.Fetch);
router.get('/fetchd',verifyAdmin,fetchd.Fetchd);
router.get('/fetcho',fetchd.Fetcho);
router.get('/fetchu',verifyAdmin,fetchd.Fetchu);
router.get('/fetcht',verifyAdmin,fetchd.Fetcht);
router.post('/fetchuser',fetchuser.Fetchuser)
router.post('/updatestatus',verifyAdmin,updatestatus.Updatestatus);
router.post('/banuser',updatestatus.banUser);
router.post('/unbanuser',updatestatus.unbanUser);
router.post('/refrallist',verifyAdmin,AdminController.Distribute);
router.post('/addreferral',verifyAdmin,addreferral.AddReferral);
router.get('/fetchactiveuser',verifyAdmin,fetchactiveuser.Fetchactiveuser);
router.get('/fetchinactiveuser',verifyAdmin,fetchinactiveuser.Fetchinactiveuser);
router.get('/fetchalluser',verifyAdmin,fetchalluser.Fetchalluser);
router.get('/fetchtotalsoldtoken',verifyAdmin,fetchtotalsoldtoken.Fetchtotalsoldtoken);
router.get('/fetchtotaltoken',verifyAdmin,fetchtotaltoken.Fetchtotaltoken)
router.get('/fetchreferredtoken',verifyAdmin,fetchreferredtoken.Fetchreferredtoken)
router.get('/fetchlast',verifyAdmin,fetchlast.Fetchlast)
router.get('/fetchlast1',verifyAdmin,fetchlast1.Fetchlast1)
router.get('/fetchlast2',fetchlast2.Fetchlast2)
router.get('/fetchlast3',verifyAdmin,fetchlast3.Fetchlast3)
router.get('/fetchlast4',verifyAdmin,fetchlast4.Fetchlast4)
router.get('/fetchlast5',verifyAdmin,fetchlast5.Fetchlast5)
router.get('/fetchlast6',verifyAdmin,fetchlast6.Fetchlast6)
router.get('/fetchadmintoken',verifyAdmin,fetchadmintoken.Fetchadmintoken)
router.post('/fetchrefree',fetchrefree.Fetchrefree);
router.get('/fetch24',fetch24.Fetch24);



router.get('/logout',function(req,res,next){
	var Cookietoken =req.cookies.Admin||req.cookies.Auth;
	jwt.verify(Cookietoken, process.env.JWT_SECRET, function(err,decoded){
		if(err){
			if(err.message =="jwt expired"){
				return res.json({status:false, mess:'token expired.'});
			}
			return res.json({status:false, mess:'You are not authenticate person.'});
		} else {
			User.update({_id: decoded._id},{$pull:{jwtToken:{token:Cookietoken}}},{new:true}).then(function(res){
				if(!res || res=='')return res.send({ status: false, mess: 'no user exist'});
			}).catch(function(err){
				console.log(err)
					return res.send({ status: false, mess: 'wrong'});
			});
		}
	});
	res.clearCookie('Auth')
	res.clearCookie('Admin')
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
	res.status(200).json({status:true,mess:'Logout Successfully'})
})
;
module.exports = router;
