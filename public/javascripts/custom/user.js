var b = $("#list_of_managed_countries");
0 < b.length && 0 < $("input[id\x3dphone]").length && ($("input[id\x3dphone]").intlTelInput({
    onlyCountries: b.text().split(","),
    nationalMode: !1,
    autoHideDialCode: !1,
    customPlaceholder: function(a, b) {
        return "Phone Number"
    },
    initialCountry: "auto",
    geoIpLookup: null,
    geoIpLookup: function(callback) {
        $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
            var countryCode = (resp && resp.country) ? resp.country : "";
            callback(countryCode);
        });
    },
    separateDialCode: !0,
    preferredCountries: [],
    width: "100%"
}), $("#country").val() ? $("#phone").intlTelInput("setCountry", $("#country").val()) : $("#country").val("af"), $("#phone").on("countrychange", function(b, d) {
    $("#country").val(d.iso2.toUpperCase())
}));


$("#userRegisterForm").submit(function(e){
    e.preventDefault();
    document.getElementById('Username').focus();    
	var name        =   document.getElementById('Username').value;
	var emailraw       =   document.getElementById('Useremail').value;
	var email = emailraw.toLowerCase();
	var password    =   document.getElementById('Userpassword').value;
    var repassword    =   document.getElementById('cUserpassword').value;
    var country = null;
    var countryCode = null;
    var phone       = document.getElementById('phone').value;

    if($('.selected-flag')){
        if($('.selected-flag').attr('title')){
            var flagName  = $('.selected-flag').attr('title');
            var flagNameSplit = flagName.split(':');
            var country = flagNameSplit[0];
            var countryCode = flagNameSplit[1];
        }
    }
    var checkbox    = document.getElementById("Usertnc").checked;
    var ref         = document.getElementById('ref').value;

    if(name =='')    
    {
        document.getElementById('Username').focus();
        document.getElementById('NameError').innerText='Name field cannot be left blank';        
        document.getElementById('EmailError').innerText='';        
        document.getElementById('PassError').innerText='';        
        document.getElementById('RepassError').innerText='';        
        document.getElementById('NumberError').innerText='';        
        document.getElementById('checkerror').innerText='';    
        return false;
    }
    else if(email =='')
	{   
        document.getElementById('Useremail').focus();
        document.getElementById('EmailError').innerText='E-Mail field cannot be left blank';        
        document.getElementById('NameError').innerText='';                
        document.getElementById('PassError').innerText='';        
        document.getElementById('RepassError').innerText='';        
        document.getElementById('NumberError').innerText='';
        document.getElementById('checkerror').innerText='';
        return false;
    }
    else if(password =='')
	{
        document.getElementById('Userpassword').focus();
        document.getElementById('PassError').innerText='Password field cannot be left blank';        
        document.getElementById('NameError').innerText='';        
        document.getElementById('EmailError').innerText='';              
        document.getElementById('RepassError').innerText='';        
        document.getElementById('NumberError').innerText='';
        document.getElementById('checkerror').innerText='';
        return false;
    }
    else if(repassword =='')
	{
        document.getElementById('cUserpassword').focus();
        document.getElementById('RepassError').innerText='Please fill this field to confirm the entered password';        
        document.getElementById('NameError').innerText='';        
        document.getElementById('EmailError').innerText='';        
        document.getElementById('PassError').innerText='';                
        document.getElementById('NumberError').innerText='';
        document.getElementById('checkerror').innerText='';        
        return false;
    }
    else if(phone =='')
	{
        document.getElementById('phone').focus();
        document.getElementById('NumberError').innerText='Please enter your valid contact number';        
        document.getElementById('NameError').innerText='';
        document.getElementById('checkerror').innerText='';
        document.getElementById('EmailError').innerText='';        
        document.getElementById('PassError').innerText='';        
        document.getElementById('RepassError').innerText='';        
        return false;
    }
    // else if(country =='')
	// {
    //     document.getElementById('country').focus();
    //     document.getElementById('NameError').innerText='Name field cannot be left blank';        
	// 	return false;
    // }
    else if(password.length<8)
    {
        document.getElementById('Userpassword').value='';                
        document.getElementById('PassError').innerText='Please enter the password of minimum eight characters';        
        document.getElementById('Userpassword').focus();
        return false;
    }
    else if(password!=repassword)
	{
        document.getElementById('cUserpassword').value='';        
        document.getElementById('cUserpassword').focus();
        document.getElementById('RepassError').innerText='Please enter the same password as entered above';        
		return false;
    }
    else if(!checkbox)
	{
        swal({
            title: 'Terms And Conditions',
            text: "Please accept our terms and conditions",
            type: 'info',
          })
        document.getElementById('Usertnc').focus();
        document.getElementById('NumberError').innerText='';        
		document.getElementById('NameError').innerText='';        
        document.getElementById('EmailError').innerText='';        
        document.getElementById('PassError').innerText='';        
        document.getElementById('RepassError').innerText='';        
		return false;
    }else if(!countryCode && !country){
        document.getElementById('NameError').innerText='Name field cannot be left blank';        
        return false;   
    }
    else{
        $("#signupload").addClass("loadersmall");
        document.getElementById('signupbtn').disabled=true;
        axios.post('/api/register', {
            name:  name,
            email: email,
            password: password,
            confPass: repassword,
            country:country,
            countryCode:countryCode,
            phone:phone,
            reference: ref,
        })
        .then((response) => {
            if (response.data.status) {
        $("#signupload").removeClass("loadersmall");                
                swal({
                    title: 'Successful!!!',
                    text: "A verification mail has been send to your mail Id",
                    timer: 1500,
                    type: 'info',
                    
                    showConfirmButton:false
                  })
                 setTimeout(function(){window.location='/'},5000)    
               document.getElementById('signupbtn').disabled=false;
                document.getElementById("userRegisterForm").reset();
                window.location='/';
            }
            else{
        $("#signupload").removeClass("loadersmall");                                
                swal({
                    title: 'Error',
                    text: `${response.data.mess}`,
                    timer: 1500,
                    type: 'error',
                  })               
                document.getElementById('signupbtn').disabled=false;
            }
        })
        .catch((err) => {
            document.getElementById('signupbtn').disabled=false;
        });
    }   
})

function myfunction(){
    document.getElementById('NumberError').innerText='';        
    document.getElementById('NameError').innerText='';
    document.getElementById('checkerror').innerText='';
    document.getElementById('EmailError').innerText='';        
    document.getElementById('PassError').innerText='';        
    document.getElementById('RepassError').innerText=''; 
    document.getElementById('loginEmailError').innerText='';
    document.getElementById('loginPasswordError').innerText=''; 
}




$("#userloginform").submit(function(e){
	e.preventDefault();
	
	var emailraw       =   document.getElementById('logemail').value;
	var email = emailraw.toLowerCase();
	var password    =   document.getElementById('logpass').value;
    // console.log(emailraw,password)
    if(email =='')
	{
        document.getElementById('loginEmailError').innerText='Please enter the E-mail for log in';
        document.getElementById('loginPasswordError').innerText='';
        // document.getElementById('logemail').focus();
		return false;
    }
    else if(password =='')
	{
        document.getElementById('loginEmailError').innerText='';
        document.getElementById('loginPasswordError').innerText='Please enter the password for log in';
        // document.getElementById('logpass').focus();
		return false;
    }
    // if (document.getElementById('rememberme').checked) {
    //     var a = [];
    //     a.push(email, password);
    //     localStorage.setItem('User', JSON.stringify(a));
    // }

    else{
        document.getElementById('m_login_signin_submit').disabled=true;
        // console.log("login email",email);
        // console.log("login ",password);
        axios.post('/api/login', {
            //name:  name,
            email:email,
            password: password
            //confPass: repassword,
            //countrycode:countryData.iso2,
            //country:  country,
            //number: phone,
           // ref: ref,
        })        
        .then((response) => {
            // console.log('111111',response.data.tfastatus)
            if(response.data.status){
            if(response.data.tfastatus ===false) {
                // console.log('@@@@@@@@@@@@@@@@@',response)
                swal({
                    title: 'Authentication Successful!',
                    text: 'Logging In...',
                    type: 'success',
                    timer: 1500,
                    showConfirmButton:false                    
                })
                setTimeout(function(){window.location='/dashboard'},2000)      
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem("jwtToken", response.data.token);
                }
                document.getElementById('m_login_signin_submit').disabled=false;
                document.getElementById("userloginform").reset();
                if(response.data.adminstatus)
                setTimeout(function(){window.location='/admindashboard'},2000);
                // else{
                //     window.location='/dashboard'
                // }
            }
                else{
                    $("#signload").addClass("loadersmall");
                    document.getElementById('m_login_signin_submit').disabled = true;
                    axios.post('/api/tfaemail', {
                        email:email
                    })
                   .then((res) => {
                       console.log(res)
                        if(res.data.status){
                        $("#signload").removeClass("loadersmall");
                        swal({
                                title: 'OTP Sent!!!',
                                text: res.data.mess,
                                type: 'success',
                                showConfirmButton: true
                            }).then((result)=>{
                                if(result.value){
                                    $('#signinOtpModal').modal('toggle');
                                    if (typeof(Storage) !== "undefined") {
                                        localStorage.setItem("email", response.data.email);
                                        }
                                     document.getElementById('m_login_signin_submit').disabled = false;
                                        
                                    }
                            })
                            // setTimeout(function() {
                            //     window.location = '/verifyotp'
                            // }, 1000)
                            // if (typeof(Storage) !== "undefined") {
                            //     localStorage.setItem("email", response.data.email);
                            // }
                            // document.getElementById('signinbtn').disabled = false;
                            }
                        else{
                            swal({
                                title: 'OTP not Sent!!!',
                                text: `${res.data.mess}`,
                                type: 'error',
                                timer: 6000
                            })
                            $("#signload").removeClass("loadersmall");
                            document.getElementById('m_login_signin_submit').disabled = false;
                        }
                    })
    
                }
    
            }
            else{
                swal({
                    title: 'Error',
                    text: `${response.data.mess}`,
                    type: 'error',                    
                })
                document.getElementById('m_login_signin_submit').disabled=false;
            }
        })
        .catch((err) => {
            document.getElementById('m_login_signin_submit').disabled=false;
        });
    }
})


function forpassreq()
{
var remail=document.getElementById('m_email').value;
var email = remail.toLowerCase();
if(email =='')
	{
        document.getElementById('m_email').focus();   
		return false;
    }
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$("#forpassactivation").submit(function(e){
    e.preventDefault();
    document.getElementById("reqforpass").disabled=true;
    var forpassemail        =   document.getElementById('forpassemail').value;
    var email = forpassemail.toLowerCase();
    axios.post('/api/getForPassLink',{
    email:email
    }).then((response)=>{
        if (response.data.status) {
            swal({
                title: 'Mail Sent!!!',
                text: 'The mail has been sent on your mail-id',
                type: 'success',
                timer:3000,
                showConfirmButton:false                    
            })
            setTimeout(function(){window.location='/'},3000)                                           
            document.getElementById('reqforpass').disabled=false;
            document.getElementById("forpassactivation").reset();         
        }
        else{
            swal({
                title: 'Registration Incomplete!!!',
                text: `${response.data.mess}`,
                type: 'error',
                timer:6000                    
            })
            document.getElementById('reqforpass').disabled=false;                           
            document.getElementById('forpassactivation').focus();
        }
    })
    .catch((err) => {
        console.log("Error",err);
})
})



function editinformation(){
    // document.getElementById('savebasicinfo').disabled=false;                               
    var changedname=document.getElementById('changedname').value;
    var changedemail=document.getElementById('changedemail').value;
    var changednumber=document.getElementById('changednumber').value;
    if(changedname==""|| changedemail==""||changednumber=="")
    {
      alert("Please fill all the fields");
       document.getElementById('savebasicinfo').disabled=false;
    }
    else
    {
    axios.post('/api/editBasicInfo',{
    changedname:changedname,
    changedemail:changedemail,    
    changednumber:changednumber
    })
    .then((response)=>{
        console.log(response)
        if(response.data.status)
        {
            if(response.data.email){
                swal({
                    title: 'Updated Successfully!',
                    text: `A verification mail has been sent successfully to your account`,
                    type: 'success', 
                    timer:3000,
                    showConfirmButton:false                   
                })
                setTimeout(function(){logout()},3000)      
                
            }
            else{
                swal({
                    title: 'Updated Successfully!',
                    text: `Information Saved Successfully`,
                    type: 'success',       
                    showConfirmButton:false             
                }) 
                setTimeout(function(){window.location='/settings'},1000)      
                                       
            }
        }
    })
    .catch((err) => {
        console.log("Error",err);
    });
}
}
    


function editname(){
    console.log("inside editname function")
    document.getElementById('savebasicinfo').disabled=false;                                   
    document.getElementById("changedname").disabled=false;
}

function editemail(){
    console.log("inside editemail function")

    document.getElementById("changedemail").disabled
}

function editnumber(){
    console.log("inside editnumber function")
    document.getElementById('savebasicinfo').disabled=false;                                   
    document.getElementById("changednumber").disabled=false;
}


$("#changepassword").submit(function(e){
    e.preventDefault();
    var currentpass=document.getElementById('currentpass').value;
    var newpass=document.getElementById('newpass').value;
    var vernewpass=document.getElementById('vernewpass').value;
    if(currentpass==""|| newpass==""||vernewpass=="")
    {
    swal({
        title: 'Field(s) blank',
        text: `Please fill all the fields`,
        type: 'error',                    
    })
    }

    else if(newpass.length<8)
    {
        document.getElementById('newpasserror').innerText='Please enter new password of atleast 8 characters';        
        document.getElementById('vernewpasserror').innerText='';   
    }
    
    else if(newpass!=vernewpass)
    {
        document.getElementById('newpasserror').innerText='';        
        document.getElementById('vernewpasserror').innerText='Your passwords do not match with each other'; 
    }
    else
    {
    axios.post('/api/chaPass',{
    currentPassword:currentpass,
    newPassword:newpass,    
    confirmPassword:vernewpass
    })
    .then((response)=>{
        // console.log(response)
        if(response.data.status)
        {
            swal({
                title: 'Updated Successfully!',
                text: `Password Updated`,
                type: 'success',                    
            })
            document.getElementById("changepassword").reset();
        }
        else{
            swal({
                title: 'Not Updated ',
                text: response.data.mess,
                type: 'info',                    
            })
        }
    })
    .catch((err) => {
        console.log("Error",err);
    });
}
})
function myfunction0(){
    document.getElementById('newpasserror').innerText='';        
    document.getElementById('vernewpasserror').innerText='';
}


function tfa() {
    var flag = '';
    if (document.getElementById("2fa").checked)
        flag = true;
    else
        flag = false;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
    axios.post('/api/tfa', {
        tfastatus: flag

    }).then((response) => {
        console.log('RES', response)
        if (response.data.status) {
            console.log(response.data.mess);
        }

    }).catch((err) => {
        console.log("Error", err);
    });
}

function tfalogin(){
    var email = localStorage.getItem('email');
    var otp = document.getElementById('otplogin').value;
    // console.log('VALUE',email,otp)
    axios.post('/api/tfaverify',{
        email:email,
        otp:otp

    }).then((res) => {
        // console.log('RESp',res)
        if(res.data.status){
            swal({
                title: 'Authentication Successful!',
                text: 'Logging In...',
                type: 'success',
                // timer: 2000,
                showConfirmButton: false
            })
            setTimeout(function() {
                window.location = '/dashboard'
            }, 2500)
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem("jwtToken", res.data.token);
            }
            localStorage.setItem('email','');

        }
        else {
            swal({
                title: 'Error',
                text: `${res.data.mess}`,
                type: 'error',
            })
        }
        
    })

   

}
