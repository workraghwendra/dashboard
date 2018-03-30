var Order = require('./../modal/order')
var User = require('./../modal/user')
var mongoose = require('mongoose');

Fetchactiveuser = ((req, res) => {
    var type = req.body.type
    User.find({
        "status.active": "true",'status.type':2
    }).count().then((result) => {
        if (!result) {
            res.send({
                status: false,
                msg: 'No User found'
            });
        }
        res.send({
            status: true,
            msg: 'total number of user',
            response: result
        });
    }).catch((error) => {
        res.send({
            status: 'false',
            message: 'unable to read data',
            response: result
        })
    })
})
Fetchinactiveuser = ((req, res) => {
    var type = req.body.type
    User.find({
        "status.active": "false"
    }).count().then((result) => {
        if (!result) {
            res.send({
                status: false,
                msg: 'No User found',
                response: result
            });
        }
        res.send({
            status: true,
            msg: 'total number of user',
            response: result
        });
    }).catch((error) => {
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })
})

Fetchalluser = ((req, res) => {
    var type = req.body.type
    User.find({
        "status.type": 2
    }).count().then((result) => {
        if (!result) {
            res.send({
                status: false,
                msg: 'No User found'
            });
        }
        res.send({
            status: true,
            msg: 'total number of user',
            response: result
        });
    }).catch((error) => {
        res.send({
            status: 'false',
            message: 'unable to read data',
            response: result
        })
    })
});

Fetchtotalsoldtoken = ((req, res) => {
    
    User.find().then((response) => {
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found'
            });
        }
       
        var length = response.length;
        
        var j = [];
        for (i = 0; i < length; i++) {

            j.push(response[i].purchasedcoins)

        }
       

        var sum = 0;
        for (k = 0; k < j.length; k++) {
            sum += j[k];
        }
        
        res.send({
            status: true,
            msg: 'all user',
            response: sum
        })
    }).catch((error) => {
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })

})


Fetchtotaltoken = ((req, res) => {
    
    User.find().then((response) => {
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found'
            });
        }
       
        var length = response.length;
        
        var m = [];
        for (n = 0; n < length; n++) {

            m.push(response[n].totalToken)

        }
       

        var sum = 0;
        for (i = 0; i < m.length; i++) {
            sum += m[i];
        }
       
        res.send({
            status: true,
            msg: 'all user',
            response: sum
        })
    }).catch((error) => {
        
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })

})

Fetchreferredtoken = ((req, res) => {
   
    User.find().then((response) => {
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found'
            });
        }
       
        var length = response.length;
       
        var m = [];
        for (n = 0; n < length; n++) {

            m.push(response[n].referredcoins)

        }
      

        var sum = 0;
        for (i = 0; i < m.length; i++) {
            sum += m[i];
        }
        
        res.send({
            status: true,
            msg: 'all user',
            response: sum
        })
    }).catch((error) => {
       
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })

})


Fetchlast = ((req, res) => {
    Order.find({
        "time_created": {
            $gt: Date.now() / 1000 - 24 * 60 * 60
        },
        'status': 100
    }).count().then((response) => {
       
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found',
                response: response
            });
        }
        res.send({
            status: true,
            msg: 'all user',
            response: response
        });
    }).catch((error) => {
        
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })
})


Fetchlast1 = ((req, res) => {
    Order.find({
        "time_created": {
            $gt: Date.now() / 1000 - 24 * 60 * 60
        },
        'status': 0
    }).count().then((response) => {
        
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found',
                response: response
            });
        }
        res.send({
            status: true,
            msg: 'all user',
            response: response
        });
    }).catch((error) => {
       
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })

})

Fetchadmintoken = ((req, res) => {
    var type = req.body.type
    Order.find({
        "payment_address": "By admin"
    }).then((response) => {
        console.log(response)
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found'
            });
        }
       
        var length = response.length;
       
        var m = [];
        for (n = 0; n < length; n++) {

            m.push(response[n].enm)

        }
       


        var sum = 0
        for (i = 0; i < m.length; i++) {
            sum += m[i];
        }
        res.send({
            status: true,
            msg: 'all user',
            response: sum
        })
    }).catch((error) => {
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })
})

Fetchlast2 = ((req, res) => {
    Order.find({
        "time_created": {
            $gt: Date.now() / 1000 - 24 * 60 * 60
        }
    }).count().then((response) => {
        
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found',
                response: response
            });
        }
        res.send({
            status: true,
            msg: 'all user',
            response: response
        });
    }).catch((error) => {
        
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })
})

Fetchlast3 = ((req, res) => {
    Order.find().count().then((response) => {
      
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found',
                response: response
            });
        }
        res.send({
            status: true,
            msg: 'all user',
            response: response
        });
    }).catch((error) => {
        
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })
})

Fetchlast4 = ((req, res) => {
    Order.find({
        status: 100
    }).count().then((response) => {
       
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found',
                response: response
            });
        }
        res.send({
            status: true,
            msg: 'all user',
            response: response
        });
    })
})
Fetchlast5 = ((req, res) => {
    Order.find({
        status: 0
    }).count().then((response) => {
       
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found',
                response: response
            });
        }
        res.send({
            status: true,
            msg: 'all user',
            response: response
        });
    
    }).catch((error) => {
        
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })
})

Fetchlast6 = ((req, res) => {
    Order.find({
        status: -1
    }).count().then((response) => {
     
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found',
                response: response
            });
        }
        res.send({
            status: true,
            msg: 'all user',
            response: response
        });
    }).catch((error) => {
        
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })
})


Fetch24 = ((re, res) => {
    User.find({
        "created": {
            $gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
    }).count().then((response) => {
        
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found',
                response: response
            });
        }

        res.send({
            status: true,
            msg: 'all user',
            response: response
        });
    }).catch((error) => {
        
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })
})

Fetchd = ((req, res) => {
    User.aggregate([{
        $match:{
            'status.type':2
        }},{

            $group: {
                _id: {
                    month: {
                        $month: "$created"
                    },
                    day: {
                        $dayOfMonth: "$created"
                    },
                    year: {
                        $year: "$created"
                    }
                },

                count: {
                    $sum: 1
                }
            }

        },
        {
            $sort: {
                _id: -1
            }
        }
    ]).then((response) => {
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found',
                response: response
            });
        }
      
        var d = response.reverse()
        res.send({
            response: d
            
        });
    }).catch((error) => {
       
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })
})


Fetcho = ((req, res) => {
    Order.aggregate([
    

        {
            "$project": {
                "time_created": {
                    "$add": [new Date(0), "$time_created"]
                },
                "msisdn": 1
            }
        },
        {
            $group: {
                _id: {
                    month: {
                        $month: "$time_created"
                    },
                    day: {
                        $dayOfMonth: "$time_created"
                    },
                    year: {
                        $year: "$time_created"
                    }
                },

                count: {
                    $sum: 1
                }
            }

        }
    ]).then((response) => {
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found',
                response: response
            });
        }
       
var e =response.reverse()
        res.send({
            response: e
        });
    }).catch((error) => {
       
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })
})


Fetchu = ((req, res) => {
    Order.aggregate([{
        $match:{
            'status':100
        }},

        {
            "$project": {
                "time_created": {
                    "$add": [new Date(0), "$time_created"]
                },
                "usd": 1,
                "msisdn":1
            }
        },
        {
            $group: {
                _id: {
                    month: {
                        $month: "$time_created"
                    },
                    day: {
                        $dayOfMonth: "$time_created"
                    },
                    year: {
                        $year: "$time_created"
                    }
                },

                total: {
                    $sum: "$usd"
                }
            }

        }
    ]).then((response) => {
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found',
                response: response
            });
        }
       
var f= response.reverse()
        res.send({
            response: f
        });
    }).catch((error) => {
       
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })
})


Fetcht = ((req, res) => {
    Order.aggregate([

        {
            "$project": {
                "time_created": {
                    "$add": [new Date(0), "$time_created"]
                },
                "enm": 1,
                "msisdn": 1
            }
        },
        {
            $group: {
                _id: {
                    month: {
                        $month: "$time_created"
                    },
                    day: {
                        $dayOfMonth: "$time_created"
                    },
                    year: {
                        $year: "$time_created"
                    }
                },

                total: {
                    $sum: "$enm"
                }
            }

        }
    ]).then((response) => {
        if (!response) {
            res.send({
                status: false,
                msg: 'No User found',
                response: response
            });
        }
        
var g=response.reverse()
        res.send({
            response: g
        });
    }).catch((error) => {
        
        res.send({
            status: 'false',
            message: 'unable to read data'
        })
    })
})



module.exports = {
    Fetchactiveuser,
    Fetchinactiveuser,
    Fetchalluser,
    Fetchtotalsoldtoken,
    Fetchtotaltoken,
    Fetchreferredtoken,
    Fetchlast,
    Fetchlast1,
    Fetchadmintoken,
    Fetchlast2,
    Fetchlast3,
    Fetchlast4,
    Fetchlast5,
    Fetchlast6,
    Fetch24,
    Fetchd,
    Fetcho,
    Fetchu,
    Fetcht
}