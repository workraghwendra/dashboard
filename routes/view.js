var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
var UserController = require('../api/controller/user');
var coinDetail 	= require('../api/modal/coindetail');;
var User = require('../api/modal/user')
// var coinDetail 	= require('../api/modal/coindetail');
var btctousd='';
var ethtousd='';
var config= require("./../config");
/* GET home page. */


var verifyToken = function(req,res,next){
	// console.log('+++++++++',req)
	var token = req.body.token || req.query.token || req.headers['authorization'] || req.headers.Authorization || req.cookies.Auth;
	if(token){
		jwt.verify(token, process.env.JWT_SECRET, function(err,decoded){
			if(err){
				if(err.message="jwt expired"){
					return res.redirect('/');
				}
				return res.redirect('/');
			} else {
				coinDetail.findOne({},(err,codet) => {
					if(codet){
						User.find({'status.active':true}).count({}).then(function(users){
							return users
						}).then((users) => {
							User.findOne({_id: decoded._id}).populate('referralBonus').then(function(u){
								if(!u || u=='')return res.redirect('/');
								if(u){
                  // console.log(rq.user_data)
									req.user_data = u;
									req.user_data.tokenCounter	= parseFloat(codet.tokenCounter).toFixed(8);
									req.user_data.btcCounter	= parseFloat(codet.btcCounter).toFixed(8);
									req.user_data.ethCounter	= parseFloat(codet.ethCounter).toFixed(8);
									req.user_data.priceInUsd	= codet.priceInUsd;
									var Bonus = u.referralBonus.reduce(function(prev, b) { return prev + +b.amount;}, 0);
									req.user_data.TOTAL			= (Bonus+parseFloat(u.totalToken)).toFixed(8);
									req.user_data.userCount = users
								//	console.log("Btcspend", req.user_data);
									return next();
								}else{
									return res.redirect('/');
								}
							}).catch(function(err){
									return res.redirect('/');
							});
						})
					}else{
						User.find({'status.active':true}).count({}).then(function(users){
							return users
						}).then((users) => {
							User.findOne({_id: decoded._id}).then(function(res){
								if(!res || res=='')return res.redirect('/');
								if(res){
									req.user_data = res;
									req.user_data.tokenCounter	= '0';
									req.user_data.btcCounter	= '0';
									req.user_data.ethCounter	= '0';
									req.user_data.priceInUsd	= '0.1';
									req.user_data.userCount = users
									return next();
								}else{
									return res.redirect('/');
								}
							}).catch(function(err){
									return res.redirect('/');
							});
						})
					}
				})
			}
    });
	}else{
    return res.redirect('/');
  }
};


  var AfterLogin = function(req,res,next){
    var token = req.body.token || req.query.token || req.headers['authorization'] || req.headers.Authorization || req.cookies.Auth||req.cookies.Admin;
    if(token){
      jwt.verify(token, process.env.JWT_SECRET, function(err,decoded){
        if(err){
          if(err.message="jwt expired"){
            return next();
          }
          return next();
        } else {
          User.findOne({_id: decoded._id}).then(function(user){
            if(!user || user=='')return next()
            if(user){
							if(user.status.type==1){
							return res.redirect('/')
							}
							
							else{
              return res.redirect('/dashboard')
							}
							if(user.status.type==2){
								return res.redirect('/')
							}
							else{
								return res.redirect('/admindashboard')
							}
            }else{
              return next();
            }
          }).catch(function(err){
            return next();
          });
        }
      });
    } else {
      return next();
    }
	};
	
	var verifyAdmin = function(req,res,next){
		//	console.log(req)
			var token = req.body.token || req.query.token || req.headers['authorization'] || req.headers.Authorization || req.cookies.Admin;
		//	console.log(token)
			if(token){
				jwt.verify(token, process.env.JWT_SECRET, function(err,decoded){
					if(err){
						if(err.message="jwt expired"){
							return res.redirect('/');
						}
						return res.redirect('/');
					} else {
					coinDetail.findOne({},(err,codet) => {
							if(codet){
								User.find({'status.active':true}).count({}).then(function(users){
									return users
								}).then((users) => {
									User.findOne({_id: decoded._id}).then(function(u){
										if(!u || u=='')return res.redirect('/');
										if(u){
											req.user_data = u;
											
										//	console.log("Btcspend", req.user_data);
											return next();
										}else{
											return res.redirect('/admindashboard');
										}
									}).catch(function(err){
											return res.redirect('/');
									});
								})
							}else{
								User.find({'status.active':true}).count({}).then(function(users){
									return users
								}).then((users) => {
									User.findOne({_id: decoded._id}).then(function(res){
										if(!res || res=='')return res.redirect('/');
										if(res){
											req.user_data = res;
											
											return next();
										}else{
											return res.redirect('/');
										}
									}).catch(function(err){
											return res.redirect('/');
									});
								})
							}
						})
					}
				});
			} else {
				return res.redirect('/')
			}
		
		};

  router.get('/',AfterLogin, function(req, res, next) {
    if(req.query.id != ''){
      res.render('login',{ref:req.query.id});
    }
    else{
      res.render('login',{ref:''});
    }
  });

router.get('/dashboard',verifyToken,  function(req, res, next) {
  res.render('dashboard', {userID:req.user_data.email,res:req.user_data.totalToken,ref:req.user_data.refGenId,tokenValue:config.tokenUSDEx,totalusduser:(req.user_data.totalToken*config.tokenUSDEx),userName:req.user_data.name});
});

router.get('/order_history',verifyToken, function(req, res, next) {
  res.render('order_history', {userID:req.user_data.email,res:req.user_data.totalToken,tokenValue:config.tokenUSDEx,totalusduser:(req.user_data.totalToken*config.tokenUSDEx),userName:req.user_data.name,userpurcoins:(req.user_data.purchasedcoins).toFixed(3),userrefcoins:req.user_data.referredcoins});
});

router.get('/referral',verifyToken, function(req, res, next) {
  res.render('referral', {userID:req.user_data.email,res:req.user_data.totalToken,tokenValue:config.tokenUSDEx,totalusduser:(req.user_data.totalToken*config.tokenUSDEx),userName:req.user_data.name,ref:req.user_data.refGenId,userpurcoins:(req.user_data.purchasedcoins).toFixed(3),userrefcoins:req.user_data.referredcoins});
});

router.get('/settings', verifyToken, function(req, res, next) {
	// console.log('ddddddxxd',typeof(req.user_data.phone.number))
  res.render('settings', {tfastatus:req.user_data.status.tfa,userID:req.user_data.email,userName:req.user_data.name,userPhone:req.user_data.phone.number});
});

router.get('/faq',verifyToken, function(req, res, next) {
	//console.log('ffffff',req.user_data)
  res.render('faq', {userID:req.user_data.email,userName:req.user_data.name,userPhone:(req.user_data.phone.number),userName:req.user_data.name});
});
router.get('/adminpage',verifyAdmin, function(req, res, next){
	User.find({'status.type':2}).then((fetchAll) => {
	res.render('adminpage',{userID:req.user_data.email,res:req.user_data.totalToken,tokenValue:config.tokenUSDEx,totalusduser:(req.user_data.totalToken*config.tokenUSDEx),userName:req.user_data.name,userpurcoins:req.user_data.purchasedcoins,userrefcoins:req.user_data.referredcoins,list:fetchAll});
	});
});

router.get('/userdetail',verifyAdmin, function(req, res, next){
	res.render('userdetail',{});

});
router.get('/distribute',verifyAdmin, function(req, res, next){
	res.render('distribute',{userID:req.user_data.email,res:req.user_data.totalToken,tokenValue:config.tokenUSDEx,totalusduser:(req.user_data.totalToken*config.tokenUSDEx),userName:req.user_data.name,userpurcoins:req.user_data.purchasedcoins,userrefcoins:req.user_data.referredcoins});
});
router.get('/userstats',verifyAdmin, function(req, res, next){
	res.render('userstats',{userID:req.user_data.email,res:req.user_data.totalToken,tokenValue:config.tokenUSDEx,totalusduser:(req.user_data.totalToken*config.tokenUSDEx),userName:req.user_data.name,userpurcoins:req.user_data.purchasedcoins,userrefcoins:req.user_data.referredcoins});
})

router.get('/tokenstats',verifyAdmin, function(req, res, next){
	res.render('tokenstats',{userID:req.user_data.email,res:req.user_data.totalToken,tokenValue:config.tokenUSDEx,totalusduser:(req.user_data.totalToken*config.tokenUSDEx),userName:req.user_data.name,userpurcoins:req.user_data.purchasedcoins,userrefcoins:req.user_data.referredcoins});
});

router.get('/orderstats',verifyAdmin, function(req, res, next){
	res.render('orderstats',{userID:req.user_data.email,res:req.user_data.totalToken,tokenValue:config.tokenUSDEx,totalusduser:(req.user_data.totalToken*config.tokenUSDEx),userName:req.user_data.name,userpurcoins:req.user_data.purchasedcoins,userrefcoins:req.user_data.referredcoins});
});

router.get('/admindashboard',verifyAdmin, function(req, res, next) {
  res.render('admindashboard',{userID:req.user_data.email,res:(req.user_data.totalToken),tokenValue:config.tokenUSDEx,totalusduser:(req.user_data.totalToken*config.tokenUSDEx),userName:req.user_data.name,userpurcoins:req.user_data.purchasedcoins,userrefcoins:req.user_data.referredcoins});
});
module.exports = router;
