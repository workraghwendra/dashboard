var User = require('./../modal/user')
var mongoose = require('mongoose');
console.log('@@@@@@@@@@')
Fetchuser=((req,res)=>{
  console.log('$$$$$$$$$$$$$',req,res)
  var id=req.body.id
 console.log(id)
  User.findOne({_id:id}).then((response)=>{
    if (!response){
     res.send({status:false,msg:'No User found',response:response})
    }
      res.send({status:true,msg:'listing  user',response:response})
  }).catch((error)=>{
    console.log(error)
  //  res.render("/")
  })
});
 module.exports={Fetchuser}

 