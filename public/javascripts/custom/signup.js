$("#usernewpasswordForm").submit(function(e){
    e.preventDefault();
    var remail       =   document.getElementById('reemail').value;
    var email = remail.toLowerCase();
    var otp         =   document.getElementById('reotp').value;
    var password    =   document.getElementById('renewpassword').value;
    var repassword  =   document.getElementById('reconpassword').value;

   

        if(email =='')
	    {
            document.getElementById('reemail').focus();
            document.getElementById('chapasemailError').innerText='Please fill the email for changing password';
            document.getElementById('chapasotpError').innerText='';
            document.getElementById('chapasrepassError').innerText='';
            document.getElementById('chapascrepassError').innerText='';
		    return false;
        }
        else if(otp =='')
	    {
            document.getElementById('chapasotpError').innerText='Please enter the same OTP as before';
            document.getElementById('reotp').focus();
            document.getElementById('chapasemailError').innerText='';
            document.getElementById('chapasrepassError').innerText='';
            document.getElementById('chapascrepassError').innerText='';            
            return false;
        }
        else if(password =='')
	    {
            document.getElementById('chapasrepassError').innerText='Please enter the new passowrd';
            document.getElementById('renewpassword').focus();
            document.getElementById('chapasemailError').innerText='';
            document.getElementById('chapasotpError').innerText='';
            document.getElementById('chapascrepassError').innerText='';
	    	return false;
        }
        else if(repassword =='')
	    {
            document.getElementById('chapascrepassError').innerText='Please confirm the new passowrd';
            document.getElementById('reconpassword').focus();
            document.getElementById('chapasemailError').innerText='';
            document.getElementById('chapasotpError').innerText='';
            document.getElementById('chapasrepassError').innerText='';
		    return false;
        }
        else if(password.length<8)
        {
            document.getElementById('renewpassword').value='';                
            document.getElementById('chapasrepassError').innerText='Please enter the password of minimum eight characters';        
            document.getElementById('renewpassword').focus();
            document.getElementById('chapasemailError').innerText='';
            document.getElementById('chapasotpError').innerText='';
            document.getElementById('chapascrepassError').innerText='';
		    return false;

        }
        else if(password!=repassword)
	    {
            document.getElementById('reconpassword').value='';        
            document.getElementById('reconpassword').focus();
            document.getElementById('chapascrepassError').innerText='Please enter the same password as entered above';
            document.getElementById('chapasemailError').innerText='';
            document.getElementById('chapasotpError').innerText='';
            document.getElementById('chapasrepassError').innerText='';
    		return false;
        }
        else{
            document.getElementById("saveNewPasswordBtn").disabled=true;  
            axios.post('/api/saveNewPassword',{
            password:password,
            repassword:repassword,
            email:email,
            otp:otp
            })
            .then((response)=>{
                
                if(response.data.status){                

                    swal({
                        title: 'Successful!!!',
                        text: "Password Saved Successfully",
                        type: 'success',
                        showConfirmButton:false
                      })
                    setTimeout(function(){window.location='/'},4000) 
                    document.getElementById("saveNewPasswordBtn").disabled=false;  
                    console.log(response.data.mess);
    
                }else{

                    swal({
                        title: 'Error',
                        text: "Your password does not changed",
                        type: 'error',
                      })
                    document.getElementById("saveNewPasswordBtn").disabled=false;  
                    console.log(response.data.mess);
                }        
            }).catch((e)=>{
                console.log(e);
            })
        }
    
    
    });

    function myfunction2(){
        document.getElementById('chapasrepassError').innerText='';        
        document.getElementById('chapasemailError').innerText='';
        document.getElementById('chapasotpError').innerText='';
        document.getElementById('chapascrepassError').innerText='';  
    }