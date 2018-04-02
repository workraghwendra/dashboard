var User = require('./../modal/user');
var Coindetail = require('./../modal/coindetail');
const Async = require('async')
var async = require("async");
var Referralbonus = require('../modal/referralBonus');
var Order = require('./../modal/order')

Fetch = ((req, res) => {
    User.find({}).then((result) => {
        if (!result) {
            res.send({
                status: false,
                msg: 'No User found'
            });
        }
        res.send({
            status: true,
            msg: 'listing all users',
            response: result
        });
    }).catch((error) => {
        res.send({
            status: 'false',
            message: 'Unable to read data'
        })
    })
});

Distribute = ((req, res) => {
    console.log("res",req.body);
    var email = req.body.Email_id;
    if (!email || email == ' ' || email == undefined || email == '' || email == null) {
        return res.send({
            status: false,
            msg: 'Please enter valid email id'
        });
    }
    if (req.body.value == null || req.body.value == '' || req.body.value == undefined) {
        return res.send({
            status: false,
            msg: 'Please enter valid amount'
        });
    } else {
        User.findOne({
            email: email
        }).then((result) => {
            if (!result) {
                res.send({
                    status: false,
                    msg: 'No user found'
                })
            } else {
                var balance = parseFloat(result.totalToken);
                var value = parseFloat(req.body.value)
                var customer= req.body.Email_id;
                var Total = balance + value;
                var updatedBalance = Total.toString();
                User.findOneAndUpdate({
                    email: email
                }, {
                    $set: {
                        totalToken: updatedBalance
                    }
                }, {
                    new: true
                }).then((user) => {
                    if (!user || user === null) {
                        res.send({
                            status: false,
                            msg: 'Value not added, some error occured'
                        })
                    } else {
                        var order = new Order({


                            createdAt: {
                                type: String
                            },
                            customer_email:customer,
                            res:value,
                            
                            amountf:value*0.5,
                            payment_address: "By admin",
                            time_created: new Date().getTime(),
                            status:100,

                        })
                        order.save().then((order) => {
                            
                            if (!order) {
                                res.send({
                                    status: false,
                                    msg: 'Value not added, some error occured'
                                })
                            } else {
            if (user.referral.length != 0) 
            {
                if (req.body.refStatus === "1") 
                {
                    Async.waterfall([
                        function(callback)
                         {
                            User.findOne({
                                email: email
                            }).populate('referralBonus').then((user) => {
                                if (user.referral) {
                                    var rObj = user.referral;
                                    var totalref = rObj.length;
                                    var count = totalref - 1;
                                    var bonuspercent = 0.05;
                                    var bonus = 0;
                                    var level = totalref;
                                    //  console.log('cccccc',level)
                                    async.forEachOf(user.referral, (oid, i) => {

                                        User.findOne({
                                            _id: oid
                                        }).then((refU) => {
                                            if (refU) {
                                                level = totalref - i;

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
													bonus = 0.05;
												} else if (level == 3) {
													bonus = 0.06;
												} else if (level == 2) {
													bonus = 0.07;
												} else if (level == 1) {
													bonus = 0.08;
												}
                                                //	console.log('ddd',bonus)
                                                var referralbonus = new Referralbonus({
                                                    level: level,
                                                    from: user.email,
                                                    to: refU.email,
                                                    createdAt: new Date() / 1000,
                                                    fromUser: user,
                                                    toUser: refU,

                                                    amount: parseFloat(value) * bonus
                                                })
                                                refU.totalToken = (parseFloat(refU.totalToken) + parseFloat(parseFloat(value) * bonus));
                                                refU.referredcoins = (parseFloat(refU.referredcoins) + parseFloat(parseFloat(value) * bonus));
                                                refU.markModified('totalToken');
                                                refU.markModified('referredcoins');

                                                referralbonus.save();
                                                refU.referralBonus.push(referralbonus);
                                                refU.save();
                                                //order.save();
                                                //console.log('bonus save..............')
                                            }
                                        }).catch((err) => {
                                            //console.log(err);
                                        })
                                    })

                                    // User.findOneAndUpdate({email:email},{$set:{token:"token+value"}},{new:true},function(err,value){
                                    //     if(err){
                                    //         console.log(err)
                                    //     }
                                    //     console.log(value);
                                    // });
                                    // callback(null, refU);
                                }
                            }).catch((err) => {
                                refU = false;
                                console.log(err);
                                callback(null, refU);
                            })

                        },




                    ], function(err, result) {
                        console.log('Bonus save all successfully..............')
                    });
                    // var oldToken = parseFloat(Token.tokenCounter);
                    // var totalToken = oldToken + value;
                    // Token.tokenCounter = totalToken.toString();
                    // Token.save();
                    res.send({
                        status: true,
                        msg: 'Tokens send to user,and token added to referal also',
                        data: user
                    });
                } else {
                    // var oldToken = parseFloat(Token.tokenCounter);
                    // var totalToken = oldToken + value;
                    // Token.tokenCounter = totalToken.toString();
                    // Token.save();
                    res.send({
                        status: true,
                        msg: 'Tokens send to user, there were referal in list but you skipped the referal bonous',
                        data: user
                    });

                }
            } else {
                // var oldToken = parseFloat(Token.tokenCounter);
                // var totalToken = oldToken + value;
                // Token.tokenCounter = totalToken.toString();
                // Token.save();
                res.send({
                    status: true,
                    msg: 'Token send to user, there were no referal in list',
                    data: user
                });
            }
                                //  console.log('ffffff',order.save.then())
                                // Coindetail.findOne({}).then((Token) => {
            // console.log("ttttttttttttttttttttttttttttttttttt",Token)
                                    // if (!Token) {
                                        // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!",Token)
                                        // res.send({
                                            // status: false,
                                            // msg: 'Token distributed to the mentioned user'
                                        // });
                                    // } 
                                    // else {
            // console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",Token)
                                        
                                       
                                    // }
                                // }).catch((err) => {
                                    // console.log('e', err);
                                    // res.send({
                                        // status: false,
                                        // msg: 'some error occurred while updating total token'
                                    // });
                                // })
                            }
                        }).catch((err) => {
                            console.log('e', err);
                            res.send({
                                status: false,
                                msg: 'Some error occurred while updating total token'
                            });
                        })
                    }
                }).catch((error) => {
                    console.log(error);
                    res.send({
                        status: false,
                        msg: 'Some error occurred while providing token'
                    })
                })


            }

        }).catch((err) => {
            console.log('e4', err);
            res.send({
                status: false,
                msg: 'Some error occurred while fetching user please try again later'
            })
        })
    }
});



AddReferral = ((req, res) => {
    var useremail = req.body.email1;
    var refemail = req.body.email2;
    //console.log(refemail)
    //  console.log('fffff')
    if (!refemail || refemail == ' ' || refemail == undefined || refemail == '' || refemail == null) {
        res.send({
            status: false,
            msg: 'Please enter valid email id of refer'
        });
    }

    User.findOne({
        email: useremail
    }).then((user) => {
        //  console.log('ccccc',user.referral.length)
        if (!user || user == undefined) {
            res.send({
                status: false,
                msg: 'No user exist'
            })
        } else {
            if (user.referral.length === 0) {
                User.findOne({
                    email: refemail
                }).then((refer) => {
                   // console.log('xxxxx', refer)
                    if (!refer || refer == undefined) {
                        res.send({
                            status: false,
                            msg: 'No refer exist'
                        })
                    } else {
                        if (!refer || refer == null) {
                            res.send({
                                status: false,
                                msg: 'Some error occured'
                            })
                        }
                        if (refer.referral.length == 0) {
                            var referralcode = refer._id;
                            // console.log(referralcode);
                            User.findOneAndUpdate({
                                email: useremail
                            }, {
                                $push: {
                                    referral: referralcode
                                }
                            }, {
                                new: true
                            }).then((sucess) => {
                                if (!sucess || sucess == null) {
                                    res.send({
                                        status: false,
                                        msg: 'Some error happened,referral code not updated'
                                    })


                                }
                                res.send({
                                    status: true,
                                    msg: 'Referral code updated'
                                });

                            }).catch((err) => {
                                res.send(err);
                            })
                        }
                        if (refer.referral.length === 1) {
                            var referal = refer.referral[0]
                            //   console.log(referal)

                            User.findOneAndUpdate({
                                email: useremail
                            }, {
                                $push: {
                                    referral: referal
                                }
                            }, {
                                new: true
                            }).then((sucess) => {
                                if (!sucess || sucess == null) {
                                    res.send({
                                        status: false,
                                        msg: 'Some error occured, referral code not updated'
                                    })


                                }
                                // res.send({ status: true, msg: 'referral code updated' }); 
                                var referralcode = refer._id;
                                console.log(referralcode);
                                User.findOneAndUpdate({
                                    email: useremail
                                }, {
                                    $push: {
                                        referral: referralcode
                                    }
                                }, {
                                    new: true
                                }).then((sucess) => {
                                    if (!sucess || sucess == null) {
                                        res.send({
                                            status: false,
                                            msg: 'Some error occured, referral code not updated'
                                        })


                                    }
                                    res.send({
                                        status: true,
                                        msg: 'Referral code updated'
                                    });

                                }).catch((err) => {
                                    res.send(err);
                                })

                            }).catch((e) => {
                                res.send(e);
                            })
                        }
                        if (refer.referral.length === 2) {
                            var referal1 = refer.referral[0]
                            var referal2 = refer.referral[1]
                            // console.log(referal1)
                            // console.log(referal2)
                            User.findOneAndUpdate({
                                email: useremail
                            }, {
                                $push: {
                                    referral: referal1
                                }
                            }, {
                                new: true
                            }).then((sucess) => {
                                if (!sucess || sucess == null) {
                                    res.send({
                                        status: false,
                                        msg: 'Some error occured,referral code not updated'
                                    })


                                }
                                // res.send({ status: true, msg: 'referral code updated' }); 
                                User.findOneAndUpdate({
                                    email: useremail
                                }, {
                                    $push: {
                                        referral: referal2
                                    }
                                }, {
                                    new: true
                                }).then((sucess) => {
                                    if (!sucess || sucess == null) {
                                        res.send({
                                            status: false,
                                            msg: 'Some error occured,referral code not updated'
                                        })


                                    }
                                    //  res.send({ status: true, msg: 'referral code updated' }); 
                                    var referralcode = refer._id;
                                    console.log(referralcode);
                                    User.findOneAndUpdate({
                                        email: useremail
                                    }, {
                                        $push: {
                                            referral: referralcode
                                        }
                                    }, {
                                        new: true
                                    }).then((sucess) => {
                                        if (!sucess || sucess == null) {
                                            res.send({
                                                status: false,
                                                msg: 'Some error occured,referral code not updated'
                                            })


                                        }
                                        res.send({
                                            status: true,
                                            msg: 'Referral code updated'
                                        });

                                    }).catch((err) => {
                                        res.send(err);
                                    })
                                }).catch((e) => {
                                    res.send(e);
                                })
                            }).catch((e) => {
                                res.send(e);
                            })

                        }
                        if (refer.referral.length === 3) {
                            var referal3 = refer.referral[0]
                            var referal4 = refer.referral[1]
                            var referal5 = refer.referral[2]
                            //   console.log(referal1)
                            //   console.log(referal2)
                            User.findOneAndUpdate({
                                email: useremail
                            }, {
                                $push: {
                                    referral: referal3
                                }
                            }, {
                                new: true
                            }).then((sucess) => {
                                if (!sucess || sucess == null) {
                                    res.send({
                                        status: false,
                                        msg: 'Some error occured,referral code not updated'
                                    })


                                }
                                // res.send({ status: true, msg: 'referral code updated' }); 
                                User.findOneAndUpdate({
                                    email: useremail
                                }, {
                                    $push: {
                                        referral: referal4
                                    }
                                }, {
                                    new: true
                                }).then((sucess) => {
                                    if (!sucess || sucess == null) {
                                        res.send({
                                            status: false,
                                            msg: 'Some error occured,referral code not updated'
                                        })


                                    }
                                    //res.send({ status: true, msg: 'referral code updated' }); 
                                    User.findOneAndUpdate({
                                        email: useremail
                                    }, {
                                        $push: {
                                            referral: referal5
                                        }
                                    }, {
                                        new: true
                                    }).then((sucess) => {
                                        if (!sucess || sucess == null) {
                                            res.send({
                                                status: false,
                                                msg: 'Some error occured,referral code not updated'
                                            })


                                        }
                                        //  res.send({ status: true, msg: 'referral code updated' }); 
                                        var referralcode = refer._id;
                                        // console.log(referralcode);
                                        User.findOneAndUpdate({
                                            email: useremail
                                        }, {
                                            $push: {
                                                referral: referralcode
                                            }
                                        }, {
                                            new: true
                                        }).then((sucess) => {
                                            if (!sucess || sucess == null) {
                                                res.send({
                                                    status: false,
                                                    msg: 'Some error occured,referral code not updated'
                                                })


                                            }
                                            res.send({
                                                status: true,
                                                msg: 'Referral code updated'
                                            });

                                        }).catch((err) => {
                                            res.send(err);
                                        })

                                    }).catch((e) => {
                                        res.send(e);
                                    })
                                }).catch((e) => {
                                    res.send(e);
                                })
                            }).catch((e) => {
                                res.send(e);
                            })


                        }
                        if (refer.referral.length === 4) {
                            var referal5=refer.referral[0]
                            var referal6 = refer.referral[1]
                            var referal7 = refer.referral[2]
                            var referal8 = refer.referral[3]
                            //  console.log(referal1)
                            //  console.log(referal2)
                            User.findOneAndUpdate({email:useremail}, {$push:{referral:referal5}},{new:true}).then((sucess)=>{
                                if (!sucess || sucess == null) {
                                    res.send({
                                        status: false,
                                        msg: 'Some error occured, referral code not updated'
                                    })


                                }
                            
                            User.findOneAndUpdate({
                                email: useremail
                            }, {
                                $push: {
                                    referral: referal6
                                }
                            }, {
                                new: true
                            }).then((sucess) => {
                                //  console.log('rrrrrrr',sucess)
                                if (!sucess || sucess == null) {
                                    res.send({
                                        status: false,
                                        msg: 'Some error occured, referral code not updated'
                                    })


                                }
                                // res.send({ status: true, msg: 'referral code updated' }); 
                                User.findOneAndUpdate({
                                    email: useremail
                                }, {
                                    $push: {
                                        referral: referal7
                                    }
                                }, {
                                    new: true
                                }).then((sucess) => {
                                   // console.log('ddddd', sucess)
                                    if (!sucess || sucess == null) {
                                        res.send({
                                            status: false,
                                            msg: 'Some error occureded, referral code not updated'
                                        })


                                    }
                                    //res.send({ status: true, msg: 'referral code updated' }); 
                                    User.findOneAndUpdate({
                                        email: useremail
                                    }, {
                                        $push: {
                                            referral: referal8
                                        }
                                    }, {
                                        new: true
                                    }).then((sucess) => {
                                        if (!sucess || sucess == null) {
                                            res.send({
                                                status: false,
                                                msg: 'Some error occured, referral code not updated'
                                            })


                                        }
                                        // res.send({ status: true, msg: 'referral code updated' }); 
                                        var referralcode = refer._id;
                                        // console.log(referralcode);
                                        User.findOneAndUpdate({
                                            email: useremail
                                        }, {
                                            $push: {
                                                referral: referralcode
                                            }
                                        }, {
                                            new: true
                                        }).then((sucess) => {
                                            if (!sucess || sucess == null) {
                                                res.send({
                                                    status: false,
                                                    msg: 'Some error occured, referral code not updated'
                                                })


                                            }
                                            res.send({
                                                status: true,
                                                msg: 'Referral code updated'
                                            });

                                        }).catch((err) => {
                                            res.send(err);
                                        })

                                    }).catch((e) => {
                                        res.send(e);
                                    })

                                }).catch((e) => {
                                    res.send(e);
                                })

                            }).catch((e) => {
                                res.send(e);
                            })
                        }).catch((e)=>{
                            res.send(e);
                        })

                        }

                        if (refer.referral.length === 5) {
                            var referal5=refer.referral[0]
                            var referal6 = refer.referral[1]
                            var referal7 = refer.referral[2]
                            var referal8 = refer.referral[3]
                            var referal9 = refer.referral[4]
                            //  console.log(referal1)
                            //  console.log(referal2)
                            User.findOneAndUpdate({email:useremail}, {$push:{referral:referal5}},{new:true}).then((sucess)=>{
                                if (!sucess || sucess == null) {
                                    res.send({
                                        status: false,
                                        msg: 'Some error occured, referral code not updated'
                                    })


                                }
                            
                            User.findOneAndUpdate({
                                email: useremail
                            }, {
                                $push: {
                                    referral: referal6
                                }
                            }, {
                                new: true
                            }).then((sucess) => {
                                //  console.log('rrrrrrr',sucess)
                                if (!sucess || sucess == null) {
                                    res.send({
                                        status: false,
                                        msg: 'Some error occured, referral code not updated'
                                    })


                                }
                                // res.send({ status: true, msg: 'referral code updated' }); 
                                User.findOneAndUpdate({
                                    email: useremail
                                }, {
                                    $push: {
                                        referral: referal7
                                    }
                                }, {
                                    new: true
                                }).then((sucess) => {
                                   // console.log('ddddd', sucess)
                                    if (!sucess || sucess == null) {
                                        res.send({
                                            status: false,
                                            msg: 'Some error occureded, referral code not updated'
                                        })


                                    }
                                    //res.send({ status: true, msg: 'referral code updated' }); 
                                    User.findOneAndUpdate({
                                        email: useremail
                                    }, {
                                        $push: {
                                            referral: referal8
                                        }
                                    }, {
                                        new: true
                                    }).then((sucess) => {
                                        if (!sucess || sucess == null) {
                                            res.send({
                                                status: false,
                                                msg: 'Some error occured, referral code not updated'
                                            })


                                        }
                                        User.findOneAndUpdate({
                                            email: useremail
                                        }, {
                                            $push: {
                                                referral: referal9
                                            }
                                        }, {
                                            new: true
                                        }).then((sucess) => {
                                            if (!sucess || sucess == null) {
                                                res.send({
                                                    status: false,
                                                    msg: 'Some error occured, referral code not updated'
                                                })
    
    
                                            }
                                        // res.send({ status: true, msg: 'referral code updated' }); 
                                        var referralcode = refer._id;
                                        // console.log(referralcode);
                                        User.findOneAndUpdate({
                                            email: useremail
                                        }, {
                                            $push: {
                                                referral: referralcode
                                            }
                                        }, {
                                            new: true
                                        }).then((sucess) => {
                                            if (!sucess || sucess == null) {
                                                res.send({
                                                    status: false,
                                                    msg: 'Some error occured, referral code not updated'
                                                })


                                            }
                                            res.send({
                                                status: true,
                                                msg: 'Referral code updated'
                                            });

                                        }).catch((err) => {
                                            res.send(err);
                                        })
                                    }).catch((e) => {
                                        res.send(e);
                                    })

                                    }).catch((e) => {
                                        res.send(e);
                                    })

                                }).catch((e) => {
                                    res.send(e);
                                })

                            }).catch((e) => {
                                res.send(e);
                            })
                        }).catch((e)=>{
                            res.send(e);
                        })

                        }
                        if (refer.referral.length === 6) {
                            var referal5=refer.referral[0]
                            var referal6 = refer.referral[1]
                            var referal7 = refer.referral[2]
                            var referal8 = refer.referral[3]
                            var referal9 = refer.referral[4]
                            var referal10 = refer.referral[5]
                            //  console.log(referal1)
                            //  console.log(referal2)
                            User.findOneAndUpdate({email:useremail}, {$push:{referral:referal5}},{new:true}).then((sucess)=>{
                                if (!sucess || sucess == null) {
                                    res.send({
                                        status: false,
                                        msg: 'Some error occured, referral code not updated'
                                    })


                                }
                            
                            User.findOneAndUpdate({
                                email: useremail
                            }, {
                                $push: {
                                    referral: referal6
                                }
                            }, {
                                new: true
                            }).then((sucess) => {
                                //  console.log('rrrrrrr',sucess)
                                if (!sucess || sucess == null) {
                                    res.send({
                                        status: false,
                                        msg: 'Some error occured, referral code not updated'
                                    })


                                }
                                // res.send({ status: true, msg: 'referral code updated' }); 
                                User.findOneAndUpdate({
                                    email: useremail
                                }, {
                                    $push: {
                                        referral: referal7
                                    }
                                }, {
                                    new: true
                                }).then((sucess) => {
                                   // console.log('ddddd', sucess)
                                    if (!sucess || sucess == null) {
                                        res.send({
                                            status: false,
                                            msg: 'Some error occureded, referral code not updated'
                                        })


                                    }
                                    //res.send({ status: true, msg: 'referral code updated' }); 
                                    User.findOneAndUpdate({
                                        email: useremail
                                    }, {
                                        $push: {
                                            referral: referal8
                                        }
                                    }, {
                                        new: true
                                    }).then((sucess) => {
                                        if (!sucess || sucess == null) {
                                            res.send({
                                                status: false,
                                                msg: 'Some error occured, referral code not updated'
                                            })


                                        }
                                        User.findOneAndUpdate({
                                            email: useremail
                                        }, {
                                            $push: {
                                                referral: referal9
                                            }
                                        }, {
                                            new: true
                                        }).then((sucess) => {
                                            if (!sucess || sucess == null) {
                                                res.send({
                                                    status: false,
                                                    msg: 'Some error occured, referral code not updated'
                                                })
    
    
                                            }
                                            User.findOneAndUpdate({
                                                email: useremail
                                            }, {
                                                $push: {
                                                    referral: referal10
                                                }
                                            }, {
                                                new: true
                                            }).then((sucess) => {
                                                if (!sucess || sucess == null) {
                                                    res.send({
                                                        status: false,
                                                        msg: 'Some error occured, referral code not updated'
                                                    })
        
        
                                                }
                                        // res.send({ status: true, msg: 'referral code updated' }); 
                                        var referralcode = refer._id;
                                        // console.log(referralcode);
                                        User.findOneAndUpdate({
                                            email: useremail
                                        }, {
                                            $push: {
                                                referral: referralcode
                                            }
                                        }, {
                                            new: true
                                        }).then((sucess) => {
                                            if (!sucess || sucess == null) {
                                                res.send({
                                                    status: false,
                                                    msg: 'Some error occured, referral code not updated'
                                                })


                                            }
                                            res.send({
                                                status: true,
                                                msg: 'Referral code updated'
                                            });

                                        }).catch((err) => {
                                            res.send(err);
                                        })
                                    }).catch((e) => {
                                        res.send(e);
                                    })
                                }).catch((e) => {
                                    res.send(e);
                                })

                                    }).catch((e) => {
                                        res.send(e);
                                    })

                                }).catch((e) => {
                                    res.send(e);
                                })

                            }).catch((e) => {
                                res.send(e);
                            })
                        }).catch((e)=>{
                            res.send(e);
                        })

                        }

                        if (refer.referral.length === 7) {
                            var referal5=refer.referral[1]
                            var referal6 = refer.referral[2]
                            var referal7 = refer.referral[3]
                            var referal8 = refer.referral[4]
                            var referal9 = refer.referral[5]
                            var referal10 = refer.referral[6]
                            
                            //  console.log(referal1)
                            //  console.log(referal2)
                            User.findOneAndUpdate({email:useremail}, {$push:{referral:referal5}},{new:true}).then((sucess)=>{
                                if (!sucess || sucess == null) {
                                    res.send({
                                        status: false,
                                        msg: 'Some error occured, referral code not updated'
                                    })


                                }
                            
                            User.findOneAndUpdate({
                                email: useremail
                            }, {
                                $push: {
                                    referral: referal6
                                }
                            }, {
                                new: true
                            }).then((sucess) => {
                                //  console.log('rrrrrrr',sucess)
                                if (!sucess || sucess == null) {
                                    res.send({
                                        status: false,
                                        msg: 'Some error occured, referral code not updated'
                                    })


                                }
                                // res.send({ status: true, msg: 'referral code updated' }); 
                                User.findOneAndUpdate({
                                    email: useremail
                                }, {
                                    $push: {
                                        referral: referal7
                                    }
                                }, {
                                    new: true
                                }).then((sucess) => {
                                   // console.log('ddddd', sucess)
                                    if (!sucess || sucess == null) {
                                        res.send({
                                            status: false,
                                            msg: 'Some error occureded, referral code not updated'
                                        })


                                    }
                                    //res.send({ status: true, msg: 'referral code updated' }); 
                                    User.findOneAndUpdate({
                                        email: useremail
                                    }, {
                                        $push: {
                                            referral: referal8
                                        }
                                    }, {
                                        new: true
                                    }).then((sucess) => {
                                        if (!sucess || sucess == null) {
                                            res.send({
                                                status: false,
                                                msg: 'Some error occured, referral code not updated'
                                            })


                                        }
                                        User.findOneAndUpdate({
                                            email: useremail
                                        }, {
                                            $push: {
                                                referral: referal9
                                            }
                                        }, {
                                            new: true
                                        }).then((sucess) => {
                                            if (!sucess || sucess == null) {
                                                res.send({
                                                    status: false,
                                                    msg: 'Some error occured, referral code not updated'
                                                })
    
    
                                            }
                                            User.findOneAndUpdate({
                                                email: useremail
                                            }, {
                                                $push: {
                                                    referral: referal9
                                                }
                                            }, {
                                                new: true
                                            }).then((sucess) => {
                                                if (!sucess || sucess == null) {
                                                    res.send({
                                                        status: false,
                                                        msg: 'Some error occured, referral code not updated'
                                                    })
        
        
                                                }
                                        // res.send({ status: true, msg: 'referral code updated' }); 
                                        var referralcode = refer._id;
                                        // console.log(referralcode);
                                        User.findOneAndUpdate({
                                            email: useremail
                                        }, {
                                            $push: {
                                                referral: referralcode
                                            }
                                        }, {
                                            new: true
                                        }).then((sucess) => {
                                            if (!sucess || sucess == null) {
                                                res.send({
                                                    status: false,
                                                    msg: 'Some error occured, referral code not updated'
                                                })


                                            }
                                            res.send({
                                                status: true,
                                                msg: 'Referral code updated'
                                            });

                                        }).catch((err) => {
                                            res.send(err);
                                        })
                                    }).catch((e) => {
                                        res.send(e);
                                    })
                                }).catch((e) => {
                                    res.send(e);
                                })

                                    }).catch((e) => {
                                        res.send(e);
                                    })

                                }).catch((e) => {
                                    res.send(e);
                                })

                            }).catch((e) => {
                                res.send(e);
                            })
                        }).catch((e)=>{
                            res.send(e);
                        })

                        }

                    }
                }).catch((err) => {
                    console.log(err);
                    res.send(err);
                })
            } else {
                res.send({
                    status: false,
                    msg: 'User is already refered'
                });
            }
        }
    }).catch((err) => {
        res.send(err);
    })
})


Fetchrefree = ((req, res) => {
    // console.log(req.body.id)
    User.findOne({
        _id: req.body.id
    }).then((response) => {
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found'
            });
        }
        // console.log(response);
        // res.send({status:true,msg:'listing all users',response:response});
        var id = response.referral.slice(-1)
        // console.log('dd',id[0])
        var refreeid = id[0]
        User.findOne({
            _id: refreeid
        }).then((response1) => {
            //   console.log(result)
            if (!response1) {
                res.send({
                    status: false,
                    msg: 'No User found',
                    response: response1
                });
            }
            //  console.log(response1)
            res.send({
                status: true,
                msg: 'listing ',
                response: response1.email
            });
        }).catch((error) => {
            //  console.log(error)
            res.send({
                status: 'false',
                message: 'Unable to read data'
            })
        })
    }).catch((error) => {
        res.send({
            status: 'false',
            message: 'Unable to read data'
        })
    })
});




module.exports = {
    Fetch,
    Distribute,
    AddReferral,
    Fetchrefree
}