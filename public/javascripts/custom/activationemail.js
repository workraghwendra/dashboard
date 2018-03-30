function resendemailactivation()
{
    document.getElementById('reqforReAct').disabled=true;

    var actemail        =   document.getElementById("resendActEmail").value;
    var email = actemail.toLowerCase();
    axios.post('/api/getEmailActivationLink',{
    email:email
    }).then((response)=>{
        if (response.data.status) {

            swal({
                title: 'Mail Sent!!!',
                text: "The mail has been sent on your mail-id",
                type: 'success',
              })
            setTimeout(function(){window.location='/'},4000)
            document.getElementById("resendActEmail").reset();
        }
        else{
            swal({
                title: 'Information',
                text: `${response.data.mess}`,
                type: 'info',
              })
            document.getElementById('reqforReAct').disabled=false;
            document.getElementById("resendActEmail").value='';
        }

    })
    .catch((err) => {
        console.log("Error",err);
})
}
