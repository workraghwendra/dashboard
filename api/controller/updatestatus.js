var mongoose = require('mongoose');
var User = require('./../modal/user')

Updatestatus=((req,res)=>{
//    console.log(req.body)
var email=req.body.email;
// console.log('xxxx',email)
User.findOneAndUpdate({email:email},{$set:{"status.active":"true"}},{new:true}).then((result)=>{
   // console.log(result)
    if (!result){
        res.send({status:false,msg:'No User found'});
    }
    res.send({status:true,msg:'Status updated',response:result});
}).catch((error)=>{
   console.log(error)
 res.send({status:'false',message:'Unable to read data'})
})
});


banUser=((req,res)=>{
    // console.log(req)
 var email=req.body.email;
//  console.log('xxxx',email)
 User.findOneAndUpdate({email:email},{$set:{"status.banned":"true"}},{new:true}).then((result)=>{
    // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA",result)
     if (!result){
         res.send({status:false,msg:'No User found'});
     }
     res.send({status:true,msg:'User Banned',response:result});
 }).catch((error)=>{
    console.log(error)
  res.send({status:'false',message:'Unable to read data'})
 })
 });


 unbanUser=((req,res)=>{
    console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMM",req.body)
 var email=req.body.email;
 console.log('xxxx',email)
 User.findOneAndUpdate({email:email},{$set:{"status.banned":"false"}},{new:true}).then((result)=>{
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA",result)
     if (!result){
         res.send({status:false,msg:'No User found'});
     }
     res.send({status:true,msg:'Ban is removed from this user',response:result});
 }).catch((error)=>{
    console.log(error)
  res.send({status:'false',message:'Unable to read data'})
 })
 });


module.exports={Updatestatus,banUser,unbanUser}

