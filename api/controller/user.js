const nodemailer = require("nodemailer");
const mongodb = require('mongodb');
var ejs = require('ejs')
    var helper=require('./helper')
var axios = require('axios')
var config = require('./../../config');
const jwt = require('jsonwebtoken');
const mongoClient = require('mongodb').MongoClient;
var smtpTransport = require('nodemailer-smtp-transport');
const mongoose = require('mongoose');
var validator= require('express-validator')
var User = require('../modal/user');
var CoinDetail      = require('../modal/coindetail');
var Referralbonus 	= require('../modal/referralBonus');
var Order = require('../modal/order');
var async = require('async')
var randomstring = require('randomstring');
var qrcode = require('qrcode');
var cpay = require('coinpayments');
var client = new cpay({
    'key': process.env.COINPAYMENTAPIKEY,
    'secret': process.env.COINPAYMENTAPISECRET,
    'autoIpn': false
});
//const nodemailer = require("nodemailer"
function getBTC() 
{
	return new Promise(resolve=>{
		axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
		.then((response) => {
			if (response)
			{
				var BTCval=response.data.BTC.USD;
				resolve (BTCval);
			}
			else
			{
				console.log("Error In Connection");
			}
		})
		.catch((err) => {
			console.log(err);
		// reject(err);
		})
	})
}

function getETH() 
{
	return new Promise(resolve=>{
		axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH&tsyms=USD')
		.then((response) => {
			if (response)
			{
				var ETHval=response.data.ETH.USD;
				resolve(ETHval);    
			}
			else
			{
				console.log("Error In Connection");            
        	}
		})
		.catch((err) => {
			console.log(err);
		})
	})
}
//var transporter = nodemailer.createTransport('raghwendrapratap0194@gmail.com' + ':' + 'secular@39' + '@smtp.gmail.com');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'raghwendrapratap0194@@gmail.com',
        pass: 'qwerty@393'
    }
});
var helper = require('./helper')
var self = module.exports = {
    Login: async (req, res, next) => {
        //console.log("entered email",email,"entered password",password);
        User.findOne({
            email: req.body.email
        }, (err, user) => {
            if (err) {

                return res.json({
                    status: false,
                    tfa: false,
                    mess: res.__('SerErrTex')
                });
            }
            if (user) {
                var now = new Date().getTime();
				var expiryTime = parseInt(now + (60 *10* 1000));

                if(user.status.banned){
					return res.json({status:false,ban:true,mess:'you are suspended contact to adminsupport'});					
                }
               

               else{
                var pass = user.decrypt(user.password);

                if (pass == req.body.password) {
                     if (!user.jwtToken.length) {
                    if (user.status.active) {
                        const token = user.generateJwt();
                        // console.log(user.jwtToken)
                        user.jwtToken.push({ Type: user.status.type, token: token, Expiry: expiryTime });
                        console.log('1111',user.jwtToken)
                            user.save();
                          //  if(!user.jwtToken.length)

                        if (user.status.tfa == false) {

                            

                            if (user.status.type == 1) {
                                // console.log(token)
                                res.cookie('Admin', token);
                                return res.json({
                                    status: true,
                                    tfastatus: false,
                                    adminstatus: true,
                                    token: token
                                })
                                //console.log(token)
                            } else {

                                res.cookie('Auth', token);
                                return res.json({
                                    status: true,
                                    tfastatus: false,
                                    adminstatus: false,
                                    token: token
                                });
                            }
                        } else {
                            return res.json({
                                status: true,
                                tfastatus: true,
                                email: user.email,
                                mess: 'Two factor Authentication enabled'
                            })
                        }
                    } else {
                        return res.json({
                            status: false,
                            tfastatus: false,
                            userStatus: false,
                            mess: res.__('SerUseLogStaErrTex')
                        });
                    }
                 } else{
                    user.jwtToken.map(function(x) {
						console.log('ffffffffffffff',x.Expiry);
						if (x.Expiry < now) {
							console.log('now',now);
							console.log('ddddddddddddddddddddddddd',x.Expiry);
							user.jwtToken.splice(x, 1);
						}
                    })
                    if (user.status.active) {
                        const token = user.generateJwt();
                        // console.log(user.jwtToken)
                        user.jwtToken.push({ Type: user.status.type, token: token, Expiry: expiryTime });
                        console.log('1111',user.jwtToken)
                            user.save();
                          //  if(!user.jwtToken.length)

                        if (user.status.tfa == false) {

                            

                            if (user.status.type == 1) {
                                // console.log(token)
                                res.cookie('Admin', token);
                                return res.json({
                                    status: true,
                                    tfastatus: false,
                                    adminstatus: true,
                                    token: token
                                })
                                //console.log(token)
                            } else {

                                res.cookie('Auth', token);
                                return res.json({
                                    status: true,
                                    tfastatus: false,
                                    adminstatus: false,
                                    token: token
                                });
                            }
                        } else {
                            return res.json({
                                status: true,
                                tfastatus: true,
                                email: user.email,
                                mess: 'Two factor Authentication enabled'
                            })
                        }
                    } else {
                        return res.json({
                            status: false,
                            tfastatus: false,
                            userStatus: false,
                            mess: res.__('SerUseLogStaErrTex')
                        });
                    }

                 }
                } else {
                    // console.log('1111111')
                    return res.json({
                        status: false,
                        tfastatus: false,
                        mess: res.__('UserNoFoSerTex')
                    });
                }
                
            }
            }
            return res.json({
                status: false,
                mess: res.__('UserNoFoSerTex')
            });
        })
    },

    RegisterUser : (req, res, next) => {
		User.findOne({email:req.body.email}).then(async(response) => {
			if(response){
				return res.json({status: false, mess:res.__('SerUseRegiErrTex')});
			}

			var emailToken = randomstring.generate(64)
			var linkExpires = Date.now() + 86400000;
			var user = new User();
			user.name = req.body.name;
			user.email = req.body.email;
			user.phone.country = req.body.country;
			user.phone.countryCode = req.body.countryCode;
			user.phone.number = parseInt(req.body.phone);
			user.status.activeEmailToken = emailToken;
			user.status.activeEmailTokenExp = linkExpires;
			var len = 0;
			var referralid='';
			var checkReferral='';
			var randomgenId = randomstring.generate(7);
			user.refGenId=randomgenId;
			console.log("1",randomgenId);
			if(req.body.reference != '' && req.body.reference != undefined){
				
			 checkReferral = await User.findOne({refGenId:req.body.reference})
				if(!checkReferral){
					return res.json({status: false, mess:'Not a valid referral id'});
				}
				User.findOne({refGenId:req.body.reference})
				.then((refUser)=>{
					referralid=refUser._id;
					if(refUser.referral[0] == "")
					len = refUser.referral.length-1;
					else
					len = refUser.referral.length;
                    // console.log('length',len,refUser.referral);
                  
                    if(len == 7){
						user.referral[0]=refUser.referral[1];
						user.referral[1]=refUser.referral[2];
                        user.referral[2]=refUser.referral[3];
                        user.referral[3]=refUser.referral[4];
                        user.referral[4]=refUser.referral[5];
                        user.referral[5]=refUser.referral[6];
                        user.referral[6]=referralid;
                    }
                    if(len == 6){
						user.referral[0]=refUser.referral[0];
						user.referral[1]=refUser.referral[1];
                        user.referral[2]=refUser.referral[2];
                        user.referral[3]=refUser.referral[3];
                        user.referral[4]=refUser.referral[4];
                        user.referral[5]=refUser.referral[5];
                        user.referral[6]=referralid;
                    }
                    if(len == 5){
						user.referral[0]=refUser.referral[0];
						user.referral[1]=refUser.referral[1];
                        user.referral[2]=refUser.referral[2];
                        user.referral[3]=refUser.referral[3];
                        user.referral[4]=refUser.referral[4];
                        user.referral[5]=referralid;
                    }
					if(len == 4){
						user.referral[0]=refUser.referral[0];
						user.referral[1]=refUser.referral[1];
                        user.referral[2]=refUser.referral[2];
                        user.referral[3]=refUser.referral[3];
                        user.referral[4]=referralid;

                    }
					else if(len == 3){
						user.referral[0]=refUser.referral[0];
						user.referral[1]=refUser.referral[1];
						user.referral[2]=refUser.referral[2];
						user.referral[3]=referralid;
					}else if(len == 2){
						user.referral[0]=refUser.referral[0];
						user.referral[1]=refUser.referral[1];
						user.referral[2]=referralid;
					}else if(len == 1){
						user.referral[0]=refUser.referral[0];
						user.referral[1]=referralid;
					}else if(len == 0){
						user.referral[0]=referralid ;                                   
					}
					console.log("refObj",refObj);
					// user.referral=refObj;
				
				})
				// user.referral = req.body.ref
			}

			

			ejs.renderFile("./views/emailTemplates/emailRegister.ejs", { name:req.body.name,tokenUrl:`http://${req.headers.host}/api/activate/${emailToken}`}, function (err, data) {
				if (err) {
					console.log("Error1",err);
					return res.json({status:false,mess:res.__('SerErrTex')});
				}
				var mainOptions = {
					from: `raghwendrapratap0194@gmail.com`,
					to: req.body.email,
					subject:'Account Activation |  RESOCOIN Wallet',
					html: data
				};

				transporter.sendMail(mainOptions,  function (err, info) {
					if (err) {
						console.log("Message",err);
						return res.json({status: false, mess:res.__('SerUseTechNionEmaTex')});
					}else{
						console.log("USER INFO",info)
						user.encrypt(req.body.password);				
						console.log("User",user);						
						user.save((err) => {
							if (err) {
								console.log("Error2",err);								
								return res.json({status:false,mess:res.__('SerErrTex')});
							}
							return res.json({status:true,etoken:emailToken,mess:res.__('regiEmailSendshor')});
						});
					}
				});
			});
		})
		.catch((err) => {
			console.log("Error3",err);
			
			return res.json({status:false,mess:res.__('SerErrTex')});
		});
	},


    verifyActivation: (req, res, next) => {

        var Token = req.params.token;
        if (!Token) return res.redirect('/');


        User.findOne({
            'status.activeEmailToken': Token
        }, function(err, user) {
            if (err) {
                return res.render('./pages/common', {
                    title: res.__('UserEmaiVerifyTitTex'),
                    heading: res.__('InterSerErrTex'),
                    message: res.__('SerErrTex'),
                    linkHref: '/',
                    linkText: res.__('signInGtoLogErrTex')
                });
            }
            if (!user) {
                return res.render('./pages/common', {
                    title: res.__('UserEmaiVerifyTitTex'),
                    heading: res.__('UserThNoVaLilTex'),
                    message: res.__('UserThNoVaLilTex'),
                    linkHref: '/',
                    linkText: res.__('signInGtoLogErrTex')
                });
            }
            if (user.status.activeEmailTokenExp < Date.now() || user.status.activeEmailTokenExp == null || user.status.activeEmailTokenExp == '') {
                return res.render('./pages/common', {
                    title: res.__('CommLinExpTex'),
                    heading: res.__('CommActiLinExpTex'),
                    message: res.__('CommActiLinCliCAcExpTex'),
                    linkHref: `http://${req.headers.host}/api/resend/${user.status.activationToken}`,
                    linkText: res.__('CommActiReSenLinCliCAcExpTex')
                });
            }

            user.status.active = true;
            user.status.activeEmailTokenExp = null;
            user.status.activeEmailToken = null;

            user.save(function(err, saved) {
                if (err) {
                    return res.render('./pages/common', {
                        title: res.__('UserEmaiVerifyTitTex'),
                        heading: res.__('InterSerErrTex'),
                        message: res.__('SerErrTex'),
                        linkHref: '/',
                        linkText: res.__('signInGtoLogErrTex')
                    });
                }
                if (!saved) {
                    return res.render('./pages/common', {
                        title: res.__('UserEmaiVerifyTitTex'),
                        heading: res.__('InterSerErrTex'),
                        message: res.__('SerErrTex'),
                        linkHref: '/',
                        linkText: res.__('signInGtoLogErrTex')
                    });
                }
                return res.render('./pages/common', {
                    title: res.__('UserEmaiVerifyTitTex'),
                    heading: res.__('UseEmaiAcLinSuccTex'),
                    message: res.__('UseEmaiAcSucPlogInATex'),
                    linkHref: '/',
                    linkText: res.__('signInGtoLogErrTex')
                });
            });
        });
    },
    getForPassLink: (req, res, next) => {
        var email = req.body.email;
        var resetPasswordToken = randomstring.generate(32);
        var resetPasswordExpires = Date.now() + 600000; //10 min
        var otp = randomstring.generate(6);

        if (!email || email == null || email == '') return res.send({
            status: false,
            mess: res.__('UserEmaPassBalTex')
        });

        User.findOne({
            email: email
        }, function(err, user) {

            if (err) return res.send({
                status: false,
                mess: res.__('InterSerErrTex')
            });

            if (!user || user == null || user == undefined) return res.send({
                status: false,
                mess: res.__('signInTaccNotEx')
            });

            if (user.status.resetPassExp > Date.now()) return res.send({
                status: false,
                mess: res.__('signInRecLiAlSen')
            });

            if (user.status.active == false) return res.send({
                status: false,
                mess: res.__('signInYAccNoActP')
            });

            if (user.status.resetPassExp < Date.now() || user.status.resetPassExp == null || user.status.resetPassExp == null) {

                ejs.renderFile("./views/emailTemplates/forgotPass.ejs", {
                    name: user.name,
                    email: email,
                    tokenUrl: `http://${req.headers.host}/api/verifyForPassLink/${resetPasswordToken}/${otp}`
                }, function(err, data) {
                    if (err) {

                        return res.json({
                            status: false
                        });
                    }

                    var mainOptions = {
                        from: `raghwendrapratap0194@gmail.com`,
                        to: req.body.email,
                        subject: 'Forget Password | OFNOF',
                        html: data
                    };

                    transporter.sendMail(mainOptions, function(err, info) {
                        // console.log("INFO",info);
                        // console.log("ERROR",err);

                        if (err) {
                            return res.json({
                                status: false,
                                mess: res.__('signInInSeErrWhSMail')
                            });
                        } else {
                            user.status.resetPassExp = resetPasswordExpires;
                            user.status.resetPassToken = resetPasswordToken;
                            user.status.otp = otp;
                            user.save(function(err, saved) {
                                if (err) return res.send({
                                    status: false,
                                    mess: res.__('UserThNoVaLilTex')
                                });

                                if (saved && saved != null) {
                                    return res.send({
                                        status: true,
                                        email: email,
                                        otp: otp,
                                        mess: res.__('signInEmailSent')
                                    });
                                } else {
                                    return res.send({
                                        status: false,
                                        mess: res.__('signInSoEmOPtAftTi')
                                    });
                                }
                            });
                        }
                    });
                });
            } else {
                return res.send({
                    status: false,
                    mess: res.__('SerErrTex')
                });
            }
        });
    },
    verifyForPassLink: (req, res, next) => {


        if (!req.params) return res.redirect('/');

        var token = req.params.token;
        var otp = req.params.otp;
        // console.log(token,otp);

        if (!token || token == null || token == '' || token == undefined || !otp || otp == '') {

            return res.render('./pages/common', {
                title: res.__('singInForPassCommTI'),
                heading: res.__('UserThNoVaLilTex'),
                message: res.__('signInWaNShm'),
                linkHref: '/',
                linkText: res.__('signInGtoLogErrTex')
            });
        }

        User.findOne({
            'status.resetPassToken': token
        }, function(err, user) {

            if (err) return res.render('./pages/common', {
                title: res.__('singInForPassCommTI'),
                heading: res.__('InterSerErrTex'),
                message: res.__('SerErrTex'),
                linkHref: '/',
                linkText: res.__('signInGtoLogErrTex')
            });

            if (!user) return res.render('./pages/common', {
                title: res.__('singInForPassCommTI'),
                heading: res.__('signInSyReLinEx'),
                message: res.__('SerErrTex'),
                linkHref: '/',
                linkText: res.__('signInGtoLogErrTex')
            });

            if (user.status.resetPassExp < Date.now() || user.status.resetPassExp == null || user.status.resetPassExp == '') return res.render('./pages/common', {
                title: res.__('singInForPassCommTI'),
                heading: res.__('signInSyReLinEx'),
                message: res.__('goToForlin'),
                linkHref: '/',
                linkText: res.__('signInGtoLogErrTex')
            });

            if (user.status.resetPassExp > Date.now()) {

                user.save(function(err, saved) {

                    if (err) {
                        return res.render('./pages/common', {
                            title: res.__('singInForPassCommTI'),
                            heading: res.__('InterSerErrTex'),
                            message: res.__('SerErrTex'),
                            linkHref: '/',
                            linkText: res.__('signInGtoLogErrTex')
                        });
                    }
                    if (!saved) {

                        return res.render('./pages/common', {
                            title: res.__('singInForPassCommTI'),
                            heading: res.__('InterSerErrTex'),
                            message: res.__('SerErrTex'),
                            linkHref: '/',
                            linkText: res.__('signInGtoLogErrTex')
                        });
                    }
                    return res.render('./pages/verifyForPassLink', {
                        title: res.__('singInForPassCommTI'),
                        email: user.email,
                        otp: otp
                    });

                });
            }
        })
    },
    saveNewPassword: (req, res, next) => {
        var password = req.body.password;
        var repassword = req.body.repassword;
        var email = req.body.email;
        var otp = req.body.otp;

        if (password == repassword && password != null && repassword != null) {
            User.findOne({
                email: email,
                'status.otp': otp
            }, (err, user) => {
                if (err) {
                    res.render('error', {
                        title: res.__('toaErroTex'),
                        Heading: res.__('InterSerErrTex'),
                        Mess: res.__('SerErrTex')
                    });
                }

                var pass = user.decrypt(user.password);
                if (pass == password) {
                    return res.json({
                        status: false,
                        mess: res.__('yoCanEnAnAle')
                    });
                }
                if (password !== repassword) {
                    return res.json({
                        status: false,
                        mess: res.__('regiPassAndConfEr')
                    })
                } else {
                    user.encrypt(req.body.password)
                    user.status.otp = null;;
                    user.status.resetPassExp = null;
                    user.status.resetPassToken = null;
                    user.save(function(err) {
                        if (err) {
                            return res.json({
                                status: false,
                                mess: res.__('signInCoNoChaPAthTim')
                            })
                        }
                        return res.json({
                            status: true,
                            mess: res.__('yoPassHaCH')
                        })
                    });
                }


            });

        } else {
            return res.send({
                status: false,
                mess: res.__('UserEmaPassBalTex')
            });
        }
    },
    getEmailActivationLink : (req,res,next) => {
        var email 					=	req.body.email;
        var randomValue				=	randomstring.generate(32);
        var emailerToken			=   randomValue;
        var linkExpires				=	Date.now() + 86400000; //24 Hours
        if(!email && email=='' && email == undefined)return res.send({ status: false, mess: 'This account is not exists!'});
        User.findOne({email:email}, function(err,user){
            if(err)return res.send({ status: false, mess: res.__('InterSerErrTex')});
            if(!user)return res.send({ status: false, mess:res.__('signInTaccNotEx')});
            if(user.status.activeEmailTokenExp>Date.now())return res.send({ status: false, mess:res.__('regiVeriLAlreSTyou')});

            ejs.renderFile("./views/emailTemplates/emailRegister.ejs", { name:req.body.name,tokenUrl:`http://${req.headers.host}/api/activate/${emailerToken}`}, function (err, data) {
                if (err) {
                    return res.json({status:false});
                }

                var mainOptions = {
                    from: `raghwendrapratap0194@gmail.com`,
                    to: req.body.email,
                    subject:'Account Activation | ',
                    html: data
                };

                transporter.sendMail(mainOptions,  function (err, info) {
                    if (err) {
                        return res.json({status: false, mess:res.__('SerUseTechNionEmaTex')});
                    }else{
                        user.status.activeEmailTokenExp		=	linkExpires;
                        user.status.activeEmailToken	 	=	emailerToken;

                        user.save(function (err,saved) {
                            if(err)return res.send({ status: false, mess: res.__('InterSerErrTex')});
                            if(!saved)return res.send({ status: false, mess: res.__('InterSerErrTex')});
                            return res.send({ status: true, mess:res.__('regiCowAcVerEmailMess4')});
                        });
                    }
                });
            });
        });
},

    changPass : (req,res,next) => {

		var currentUser  		= req.user_data;
		var currentPassword     = req.body.currentPassword ;
		var newPassword    		= req.body.newPassword  ;
		var confirmPassword  	= req.body.confirmPassword;
// console.log('11111111')
		User.findOne({_id: currentUser._id},(err,user) => {
			if(err){
                // console.log(err)
				res.render('error', { title: 'Error', errorHeading:'Technical Error Occoured',errorMessage: 'We are unable to reset the password at this time. Please Try Again In Sometime.'});
			}

            var pass = user.decrypt(user.password);
            // console.log('@@@@@@@@@@@@@@@@@@@@@@@@')
			if(pass == req.body.currentPassword){
				if(pass == newPassword ){
					return res.json({status:false,mess:'You cannot use the previous password as your new password'});
				}
				if(confirmPassword !== newPassword ){
					return res.json({status:false,mess:'Passwords do not match.'})
				}else{
					user.encrypt(req.body.newPassword);
					user.save(function (err){
						if(err){
							return res.json({status:false,mess:'We are unable to reset the password at this time. Please Try Again In Sometime.'})
						}
						return res.json({status:true,mess:'Password Changed Successfully'})
					});
				}
			}else{
                console.log('@@@@@@@@@@@@@@@@@@@@@')
				return res.json({status:false,mess:'You must provide a valid current password'});
			}

		});
    },
    

    editBasicInfo  : (req,res,next) => {
		var body = req.body
		var currentUser  		= req.user_data;

		 User.findOne({_id: currentUser._id},(err,user) => {
            //  console.log('efffrr',user)
             console.log("++++++++++++++++++++++++",body)
			user.name           = body.changedname;
			user.email  = body.changedemail;
            user.phone.number    = body.changednumber;
            
			// console.log('ggregwgfefe',body.changedname,body.changedemail,body.changednumber)
			console.log('egfegrg',currentUser.email,body.changedemail)
			// console.log(currentUser.email,)
			
			if(currentUser.email == body.changedemail){
// console.log('drfedgdggf')
				user.save(function (err){
					if(err){
						return res.json({status:false,mess:'We are unable to process your request at this time. Please try again later.'})
					}
					return res.json({status:true,email:false,mess:'User Profile Updated Successfully'})
				});
			}else{
				User.findOne({email: body.changedemail},(err,users) => {
                        console.log("123",users)
                        					
					if(err){
						return res.json({status:true,mess:'We are unable to process your request at this time. Please try again later.'})
					}else{
						if(users){
							return res.json({status:true,mess:'This email already exists.'})
						}
						var token = randomstring.generate(32);
						var Expires = Date.now() + 3600000; // 1 Hour
						// console.log("456")
						user.status.activeEmailToken           =  token,
						user.status.activeEmailTokenExp    	   =  Expires,
						user.status.activTempEmail             =  body.changedemail,
						user.status.active					   =  false
						ejs.renderFile("./views/emailTemplates/emailRegister.ejs", { name:body.changedname,tokenUrl:`http://${req.headers.host}/api/activateEmail/${token}`}, function (err, data) {
							if (err) {
								return res.json({status:false,mess:'We are unable to process your request at this time. Please try again later.'});
							}

							var mainOptions = {
								from: `raghwendrapratap0194@gmail.com`,
								to:body.changedemail,
								subject:'Account Activation | RESOCOIN',
								html: data
							};

							transporter.sendMail(mainOptions,  function (err, info) {
                                console.log(err,info)
								if (err) {
									return res.json({status: false, mess:res.__('SerUseTechNionEmaTex')});
								}else{
									user.save((err) => {
                                        console.log(err)
										 if(err){
											return res.json({status:false,mess:'We are unable to process your request at this time. Please try again later.'})
										}
										
										return res.json({status:true,email:true,mess:'User Profile Updated Successfully'})
									});
								}
							});
						});
					}
				});
			}
		})
	},
    referralBonusList:(req,res,next)=>{
        var currentUser = req.user_data;
		Referralbonus.find({from:currentUser.email})
		.then((response)=>{
            if(response)
			{
				console.log(response)
				var refArray=[];
				response.forEach(function(element){
					// console.log("hello");
					  console.log(element)
					refArray.push([element.level,element.from,element.to,element.createdAt,element.amount])
					
				})
				return res.send({status:true,mess:"All Referral Bonus",result:refArray});
			}
            else
            return res.send({status:false,mess:"No Referral Bonus"});
        }).catch((e)=>{
            console.log(e);
        })
	
 
	},

    purchaseCurr: (req, res, next) => {
        // console.log('ffff', req.user_data)
            //console.log(res)
            //console.log('ssssss',req.user_data)
        var tokenQuantity = '';
        var CA = req.body.currencyamount;
        var currentUser = req.user_data;
        let currency = (req.body.currency).trim();
        let currencyamount = (req.body.currencyamount).trim();
        let tokenamount = (req.body.tokenamount).trim();
        // // backend validation start in purchasing coins
        // console.log('dhghfhgj',req.checkBody)
        		req.checkBody({
        			'currency': {
        				notEmpty: true,
        				errorMessage: 'Data not valid please re-enter'
        			},
        			'currencyamount': {
        				notEmpty: true,
        				isFloat: true,
        				isLength: {
        				options: [{ min: 1,max: 22 }],
        					errorMessage: 'BTC/ETH price not valid please re-enter'
        				},
        				errorMessage: 'Invalid BTC/ETH price !, BTC/ETH price could not be left empty and should be numeric value'
        			},
        			'tokenamount': {
        				notEmpty: true,
        				isFloat: true,
        				isLength: {
        				options: [{ min: 1,max: 22 }],
        					errorMessage: 'ENM price not valid please re-enter'
        				},
        				errorMessage: 'Invalid ENM price !, ENM price could not be left empty and should be a numeric value'
        			}
        		});

        		var errors = req.validationErrors();
        		if (errors) {
        			var  errorsMessage =  [] ;errors.forEach(function(err) {errorsMessage.push(err.msg);});
        			return res.send({status  : false,mess: errorsMessage[0]});
        		}

        		if(!parseFloat(currencyamount) >= 0.01 && !parseFloat(tokenamount) >= 0.1){
        			return res.send({status : false,mess:'Data not valid please re-enter'});
        		}

        		if(currency != "BTC" && currency != "ETH"){
        			return res.send({status : false,mess:'Currency not valid'});
        		}
        // backend validation ends in purchasing coins
var randomstringmerchant= randomstring.generate(32)
        
        //console.log("stoxprice",req.body.stoxPrice);
        // console.log(req.body)
        User.findById(currentUser._id).populate('orders').exec(
            (err, user) => {
                // console.log('dddd', err, user)
                if (err) {
                    return res.json({
                        status: false,
                        mess1: res.__('SerErrTex')
                    });
                } else if (user) {
                    var FILTER = user.orders.filter(function(d) {
                        return d.status === 0;
                    }).length

                    console.log(FILTER, 'FILTER')
                    if (FILTER >= 2) {
                        return res.send({
                            status: false,
                            limit: true,
                            mess2: '2 transactions are already pending'
                        });
                    } else {
                        // converting btc/eth currency to ENMs at backend
                        if (req.body.currency == 'BTC') {
                            var btcUSDEx = '';
                            axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
                                .then((response) => {
                                    if (response) {
                                        btcUSDEx = response.data.BTC.USD;
                                        tokenQuantity = (CA * btcUSDEx) / config.tokenUSDEx;
                                        
                                        // console.log('+++++++++++++',tokenQuantity)
                                        client.createTransaction({
                                            'currency1': req.body.currency,
                                            'currency2': req.body.currency,
                                            'amount': req.body.currencyamount,
                                            'buyer_email': req.body.email,
                                            'custom': req.body._id,
                                            'item_name': "RESOCOIN",
                                            'item_number': tokenQuantity
                                            
                                        }, function(err, result) {
                                            // console.log('123456',err)
                                            if (result) {
                                                // console.log("Result", result);
                                                var amount = parseFloat((parseFloat(result.amount)).toFixed(8));
                                                result.amount = amount;
                                                qrcode.toDataURL(`${result.address}`, {
                                                    version: 4,
                                                    errorCorrectionLevel: 'M'
                                                }, (err, qrImage) => {
                                                    result.qrcode_url = qrImage;
                                                    // console.log("request", result.txn_id, user, qrImage, req.body.currency,randomstringmerchant, tokenQuantity);
                                                    helper.InsertOrderHistory(result.txn_id, user, qrImage, req.body.currency, randomstringmerchant, tokenQuantity,btcUSDEx);
                                                    res.send({
                                                        status: true,
                                                        isCoinPayment: true,
                                                        result: result,
                                                        currency: req.body.currency
                                                    });
                                                });
                                            } else {
                                                console.log("EEEERRRRRRRROOOORRRR", err)
                                                res.send({
                                                    status: false,
                                                    mess: 'error',
                                                    error: err
                                                });
                                            }
                                        })
                                    } else {
                                        console.log('error in connection');
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                        } else if (req.body.currency == 'ETH') {
                            console.log('11111111111111111111111111111111111')
                            var ethUSDEx = '';
                            axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH&tsyms=USD')
                                .then((response) => {
                                    if (response) {
                                        ethUSDEx = response.data.ETH.USD;
                                        tokenQuantity = (CA * ethUSDEx) / config.tokenUSDEx;
                                        client.createTransaction({
                                            'currency1': req.body.currency,
                                            'currency2': req.body.currency,
                                            'amount': req.body.currencyamount,
                                            'buyer_email': currentUser.email,
                                            'custom': currentUser._id,
                                            'item_name': "RESOCOIN",
                                            'item_number': tokenQuantity
                                        }, function(err, result) {
                                            console.log(result)
                                            if (result) {
                                                var amount = parseFloat((parseFloat(result.amount)).toFixed(8));
                                                result.amount = amount;
                                                qrcode.toDataURL(`${result.address}`, {
                                                    version: 4,
                                                    errorCorrectionLevel: 'M'
                                                }, (err, qrImage) => {
                                                    result.qrcode_url = qrImage;
                                                    console.log("request", req.body);
                                                    helper.InsertOrderHistory(result.txn_id, user, qrImage, req.body.currency, randomstringmerchant, tokenQuantity,ethUSDEx);
                                                    res.send({
                                                        status: true,
                                                        isCoinPayment: true,
                                                        result: result,
                                                        currency: req.body.currency
                                                    });
                                                });
                                            } else {
                                                res.send({
                                                    status: false,
                                                    mess: 'error',
                                                    error: err
                                                });
                                            }
                                        })
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                        }


                    }

                    // converting btc/eth ends currency to ENMs at backend

                } else {
                    res.send({
                        status: false,
                        mess: 'Anything wrong happened'
                    });
                }
            })
    },


    fetchOrHis: (req, res, next) => {
        //console.log("BODY-EMAIL",req.user_data.email);
        var currentUser = req.user_data;
        User.findOne({
            _id: currentUser._id
        }).populate('orders').exec((err, user) => {
            if (err) {
                return res.json({
                    status: false,
                    mess: res.__('SerErrTex')
                });
            } {
                var array1 = [];
                user.orders.forEach(function(element) {
                    // console.log("hello");
                    // console.log(element)	
                    array1.push([element.order_id, element.time_created, element.amountf, element.receivedf, element.payment_address, element.enm, element.type, element.time_expires, element.status, element.Merchant_orderId,element.txn_id])
                })
                var reversed = array1.reverse();
                // console.log('dddd', reversed)
                return res.json({
                    status: true,
                    orderHistory: reversed
                });
            }
        })
    },
    canOrd : (req, res, next) => {
		var currentUser  		= req.user_data;
		// console.log("user",currentUser._id)
		User.findOne({ _id:currentUser._id}).populate('orders').then(function (user) {
			user.orders.forEach(function (ordeHi) {
                // console.log(ordeHi)
                console.log('hhhhhhhh', ordeHi.Merchant_orderId , req.body.oid)
			  if (ordeHi.Merchant_orderId === req.body.oid) {
				ordeHi.status = -1;
				ordeHi.save()
			  }
			});
			user.save((err) => {
				if(err){
					return res.json({status:false, mess: "We are unable to process your request at this time. Please try again later."})
				}
				return res.json({status:true,mess:"Order cancel successfully"})
			});
		}).catch(function(err){
			return res.json({status:false, mess: "We are unable to process your request at this time. Please try again later."})
		});
	},
      


	autoipnMethod: (req, res, next) => {



        console.log('==>New Hit From Coinpayment-----------------------------------', req.body)
        if (req.body) {
			console.log(req.headers)
	// 		if(,req.headers['user-agent'] !='CoinPayments.net IPN Generator')
	// {
	// console.log('==>Unauthorized use or access!.',req.headers['user-agent'])
	// return res.status(401).send('==>Unauthorized use or access!.');
	// }
            // console.log("0987654321");
            if (req.body.status && req.body.merchant && parseFloat(req.body.status) >= 100 && req.body.merchant == process.env.COINPAYMENTAPIMERCHENT) {
                console.log("0987654321");
                var mystatus = 100;
                var STATUS = 100;
                var BTCCOUNTER = '0';
                var ETHCOUNTER = '0';
                var RESPONSE = false;
                var ADDAMOUNT = 0;
                var ADDAMOUNTWO = 0;
                var ORDEROBJID = null;

                User.findOne({
                    email: req.body.email
                
                }).populate('orders').exec((err, user) => {
                    // console.log('dghrtjht',user)
                    if(!user){
                        return res.status(500).send('orders are empty');
                    }
                    if (user.orders.length == 0 || user.orders == null) {
                        return res.json({
                            status: false,
                            mess: "orders are empty"
                        })
                    }
                    user.orders.forEach(function(order) {
                        // console.log('123456',order)
                        var RESPONSE = false;
                        if (order.txn_id === req.body.txn_id) {

                            console.log('12345611111111111111111111111111111111111111111111')
                            RESPONSE = true;
                            STATUS = order.status;
                            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',order.status)
                            
                            if (STATUS == 100 || STATUS == -1) {
                                RESPONSE = false
                                console.log('==>ipn_handler==>already credited')
                            } else {
                            // console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaa',order.exValue)
                                // console.log('aaaaaaaaa',req.body.received_amount)
                                console.log(req.body)
                                if(order.type==req.body.currency1){
                                if (parseFloat(req.body.received_amount) === parseFloat (order.amountf)) {
                                    
                                    var CA = req.body. received_amount
                                    console.log('CA',CA)
                                    var tokenQuantity = ((CA * order.exValue) / config.tokenUSDEx).toFixed(8);
                                    order.usd = tokenQuantity*config.tokenUSDEx
                                    ADDAMOUNT = order.enm;
                                    console.log('@@@@@@@@@@',ADDAMOUNT,order.enm)
                                    ADDAMOUNTWO = order.amountf;
                                    order.status = mystatus;
                                    ORDEROBJID = order;
                                    order.receivedf = req.body.received_amount; //recieved amount ...
                                    order.recv_confirms = req.body.received_confirms; //recieved amount ...
                                }
                            }
                                console.log('----------',ADDAMOUNT)
                            }
                        }
                        if(RESPONSE){
							var B = '0';
							var E = '0';
							var amou2 = parseFloat(ADDAMOUNT);
							var amou = parseFloat(ADDAMOUNTWO);
							if (req.body.paymentCurrency == 'BTC') {
								B = amou;
							} else {
								E = amou;
							}
	
							console.log('addamount', typeof ADDAMOUNT, ADDAMOUNT);
							console.log('++++++',user.totalToken,amou2)
							user.totalToken = (parseFloat(user.totalToken) + parseFloat(amou2)).toFixed(2);
							user.purchasedcoins = (parseFloat(user.purchasedcoins) + parseFloat(amou2));
							user.btcSpend = (parseFloat(user.btcSpend) + parseFloat(B));
							user.ethSpend = (parseFloat(user.ethSpend) + parseFloat(E));
							order.save()
	
							user.save().then(function(savedIpn) {
								if (user.referral) {
									var rObj = user.referral;
									var totalref = rObj.length;
									var bonus = 0;
									var level = 0;
									async.forEachOf(user.referral, (oid, j) => {
										User.findOne({
											_id: oid
										})
										.then((refU) => {
											if (refU) {
												level = totalref - j;
                                                if(level ==7){
                                                    bonus = 0.02;
                                                }
                                                if(level == 6){
                                                    bonus=0.03;
                                                }
                                                if(level ==5){
                                                    bonus = 0.04;
                                                }
												if (level == 4) {
													bonus = 0.005;
												} else if (level == 3) {
													bonus = 0.06;
												} else if (level == 2) {
													bonus = 0.07;
												} else if (level == 1) {
													bonus = 0.08;
												}
												var referralbonus = new Referralbonus({
													level: level,
													from: user.email,
													to: refU.email,
													createdAt: new Date() / 1000,
													fromUser: user,
													toUser: refU,
													order: order._id,
													amount: (ADDAMOUNT * bonus).toFixed(8)
												})
												referralbonus.save();
												refU.referralBonus.push(referralbonus);
												refU.totalToken = (parseFloat(refU.totalToken) + parseFloat(ADDAMOUNT * bonus)).toFixed(8);
												refU.referredcoins = (parseFloat(refU.referredcoins) + parseFloat(ADDAMOUNT * bonus)).toFixed(8);
												refU.save();
												console.log(refU.totalToken);
												order.save();
												console.log('bonus save..............')
											}
										})
										.catch((err) => {
											console.log('====error in referrel set========', err)
										})
									})
								}
								console.log('savedIpn total token updated')
							})
							.catch(function(err) {
								console.log('ipn_handler==>could not credit', err)
							});
						}
                       
                    });
                })
			}
			else if(req.body.status && req.body.merchant && parseFloat(req.body.status) == -1 && req.body.merchant == process.env.COINPAYMENTAPIMERCHENT){
                User.findOne({
                    email: req.body.email
                }).populate('orders').exec((err, user) => {
                    if(!user){
                        return res.status(500).send('Orders are empty');
                    }
                    if (user.orders.length == 0 || user.orders == null) {
                        return res.json({
                            status: false,
                            mess: "Orders are empty here"
                        })
                    }
                user.orders.forEach(function(order) {
                    if (order.txn_id === req.body.txn_id) {
                        order.status = -1;
                        order.recv_confirms = 0;
                        order.receivedf = '0';
                        order.save();
                        console.log('Order Cancelled or TimeOut');
                    }
                });
            });
            }
            else {
                console.log('ipn_handler===>Unauthorized merchent or status 100 required')
            }
        } 
        else {
            console.log('ipn_handler==>no data found');
        }
    },
    
    tokenSold:(req,res,next)=>{
        User.aggregate([{$group: {_id:null,totalAmount:{$sum : "$totalToken"},count: { $sum: 1 }}}])
        .then((response)=>{
            console.log('response',response[0].totalAmount);
            var totalToken = response[0].totalAmount;
            var totalUser  = response[0].count;
            var totalTokenWorth = response[0].totalAmount*config.tokenUSDEx;

            res.send({status:true, totalToken,totalUser,totalTokenWorth});
        })
    },

    tfa: (req, res, next) => {
        var email = req.user_data.email;
        User.findOne({
            email: email
        }).then((user) => {
            if (req.body.tfastatus == true) {
                user.status.tfa = true;
            } else {
                user.status.tfa = false;

            }
            user.save()
            res.send({
                status: true,
                mess: 'tfa status saved'
            });
        }).catch((err) => {
            console.log('ERROR', err);
        })


    },

    tfaemail: (req, res, next) => {
        var email = req.body.email;
        var randomValue = randomstring.generate(5);
        var tfaOtp = randomValue;
        // var tfaOtpExpires = Date.now() + 600000; //10 Mins
        if (!email && email == '' && email == undefined) return res.send({
            status: false,
            mess: 'This account does not exists!'
        });
        User.findOne({
            email: email
        }, function(err, user) {
            if (err) return res.send({
                status: false,
                mess: res.__('InterSerErrTex')
            });
            if (!user) return res.send({
                status: false,
                mess: res.__('signInTaccNotEx')
            });
            // if (user.status.activetfaOtpExp > Date.now()) return res.send({ status: false, mess: 'OTP Expired. Please try after 10 mins' });

            ejs.renderFile("./views/emailTemplates/tfa.ejs", {
                name: user.name,
                Otp: tfaOtp
            }, function(err, data) {
                if (err) {
                    return res.json({
                        status: false
                    });
                }

                var mainOptions = {
                    from: `raghwendrapratap0194@gmail.com`,
                    to: req.body.email,
                    subject: 'OTP | RES',
                    html: data
                };

                transporter.sendMail(mainOptions, function(err, info) {
                    if (err) {
                        return res.json({
                            status: false,
                            mess: res.__('SerUseTechNionEmaTex')
                        });
                    } else {
                        // user.status.activetfaOtpExp = tfaOtpExpires;
                        user.status.activetfaOtp = tfaOtp;
                            //  console.log('tttttttt',user.status.activetfaOtp)
                        user.save(function(err, saved) {
                            // console.log('**********',saved )
                            if (err) return res.send({
                                status: false,
                                mess: res.__('InterSerErrTex')
                            });
                            if (!saved) return res.send({
                                status: false,
                                mess: res.__('InterSerErrTex')
                            });
                            return res.send({
                                status: true,
                                mess: 'An OTP will be sent to your mail shortly.'
                            });
                        });
                    }
                });
            });
        });
    },

    tfaverify: (req, res, next) => {
        var email = req.body.email;
        var rawotp = req.body.otp;
        var otp = rawotp.trim();
        // console.log('OTP',email,otp)
        User.findOne({
            email: email
        }, function(err, user) {
            // console.log(err, user)
            if (err) return res.send({
                status: false,
                mess: res.__('InterSerErrTex')
            });
            if (!user) return res.send({
                status: false,
                mess: res.__('signInTaccNotEx')
            });
            console.log('eeeeee',user.status)
            // if(user.status.activetfaOtpExp<Date.now()) return res.send({status:false, mess:'OTP has expired. Please login again'})
            if (user.status.activetfaOtp == otp) {
                user.status.activetfaOtp = null;
                // user.status.activetfaOtpExp=null;
                user.save();
                const token = user.generateJwt();
                res.cookie('Auth', token);
                return res.send({
                    status: true,
                    token: token,
                    mess: 'Otp verified successfully'
                })
            } else {
                return res.send({
                    status: false,
                    mess: 'Wrong OTP'
                })

            }

        })
    }
    

};
