var User            = require('../modal/user');
var CoinDetail      = require('../modal/coindetail');
var Order 			= require('../modal/order');
var cpay            = require('coinpayments');
var shortid			= require('shortid');
var client          = new cpay({'key':process.env.COINPAYMENTAPIKEY,'secret':process.env.COINPAYMENTAPISECRET,'autoIpn':false});

exports.InsertOrderHistory = function (txn_id,user,qrImage, curType,randomstringmerchant,res,exvalue) {
	// console.log("txn_id",txn_id);
	// console.log("user",user);
	// console.log("qrimage", qrImage);
	// console.log("curtype",curType);
	console.log("res",exvalue);
	// console.log(randomstringmerchant)
   client.getTx(txn_id, function(err,result){
    //   console.log("RREiiiiiiiiiit",result);
		if(result){
			var order = new Order({
				
				Merchant_orderId	:	randomstringmerchant,
				time_created        :   new Date().getTime(),
				time_expires        :   new Date().getTime()+86400000,
				status              :   result.status,
				type                :   curType,
				amountf             :   result.amountf,
				receivedf           :   result.receivedf,
				exValue				:   exvalue,
				recv_confirms       :   result.recv_confirms,
				txn_id              :   txn_id,
				payment_address     :   result.payment_address,
				qrcode_url          :   qrImage,
				res	            :   res,
				order_id			:   shortid.generate(),
				user 				:   user
			})
			order.save((err) =>{
                console.log(err)
				if(err) {
                    console.log(err)
					// return res.send({status: false,mess:'err'});
				}
				user.orders.push(order)
				user.save();
			})
		}
	});
};
