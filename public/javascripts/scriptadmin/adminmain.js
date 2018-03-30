function proceed(){
    document.getElementById("Distribute").disabled =true;
    var email = document.getElementById("Em_id").value;
   // console.log(email)
    var value = document.getElementById("value").value;
    var referalcheck= $("input[name=reDis]:checked").val();
   // console.log('ddddddd',referalcheck);
    axios.post('/api/refrallist',{
        Email_id:email,
        value:value,
       refStatus:referalcheck
    }).then((response)=>{
        if (response.data.status) {
            swal({
                title: "Success",
                text: response.data.msg,
                type: 'success',
                allowOutsideClick: true,
                html: true
                
            },
            function () {
                location.replace('/adminpage');
            });
        }else{
            swal({
                title: "Information",
                text: response.data.msg,
                type: 'info',
                allowOutsideClick: true,
                html: true
            })
        $('#Distribute').attr('disabled',false);

        }
       
    }).catch((error)=>{
       console.log(error);
    })
}



