$(document).ready(function() {
    fetchuserDetails();
    refree()
});
String.prototype.trunc = String.prototype.trunc ||
    function(n) {
        return (this.length > n) ? this.substr(0, n - 1) + '&hellip;' : this;
    };

function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function fetchuserDetails() {
    axios.post('/api/fetchuser', {
        id: getUrlVars()['id']
    }).then(function(response) {
        // console.log('dddddd',getUrlVars()['id'])
        // console.log('dgfdgf',response);
        var data = response.data.response;
        var objid = data._id
        var email = data.email
        var ban   = data.status.banned
        var name = data.name
        var country = data.phone.country
        var countryCode = data.phone.countryCode
        var phonenumber = data.phone.number
        var token = data.totalToken
        var status = data.status.active
        var referral = data.referral.length
        //  var referee=data.referral.slice(-1)
        var orders = data.orders.length
        var referralBonus = data.referredcoins
        //  console.log('dddd',objid)
        //  console.log(status);

        document.getElementById("Email1").innerHTML = email;
        document.getElementById("ban").innerHTML = ban;        
        document.getElementById("name1").innerHTML = name;
        document.getElementById("country1").innerHTML = country;
        document.getElementById("country2").innerHTML = countryCode;
        document.getElementById("num1").innerHTML = phonenumber;
        document.getElementById("num2").innerHTML = token;
        document.getElementById("num5").innerHTML = orders;
        document.getElementById("num6").innerHTML = referralBonus;
        document.getElementById("num3").innerHTML = status;
        document.getElementById("num4").innerHTML = referral;
        // document.getElementById("ref").innerHTML = referee


        if (status == false) {
            document.getElementById("update").innerHTML = "<button style='color:#189dd9' class='btn btn-primary2 m-btn m-btn--user m-btn--icon' type='button'id='update' onclick='update()' >Update </button>";
        } else {

            document.getElementById("update").innerHTML;
        }

        if(ban == false){
            document.getElementById("banBtn").innerHTML = "<button style='color:#189dd9' class='btn btn-primary2 m-btn m-btn--user m-btn--icon'  type='button'id='banBtn' onclick='ban()' >Ban </button>";
        }else{
            document.getElementById("banBtn").innerHTML;
        }

        if(ban == true){
            document.getElementById("unbanBtn").innerHTML = "<button style='color:#189dd9' class='btn btn-primary2 m-btn m-btn--user m-btn--icon'  type='button'id='unbanBtn' onclick='unban()' >Remove Ban </button>";
        }else{
            document.getElementById("unbanBtn").innerHTML;
        }

        if (referral == 0) {
            document.getElementById("add").innerHTML = "<button  style='color:#189dd9' class='btn btn-primary2 m-btn m-btn--user m-btn--icon' type='button' data-toggl='modal' onclick='AddReferral()' >Add</button>";;
        } else {
            document.getElementById("add").innerHTML;
        }


        // document.getElementById('admin-fetch').innerHTML = '';
        // getDeposite();
    }).catch(function(error) {});
};
                                                
function AddReferral() {
    document.getElementById("add").innerHTML = "<div class='input-group'><input type='text' class='form-control m-input' name='phone' placeholder='E-mail' id='email'><div class='input-group-append'><a data-toggl='modal' onclick='submit()' class='btn btn-brand btn btn-primary2 m-btn m-btn--user m-btn--icon'>Submit</a></div></div>"
}



function submit() {
    var useremail = document.getElementById("Email1").innerText;
    var refemail = document.getElementById("email").value;
    // console.log('xxxx',refemail);
    // console.log('xxxxxx',useremail);
    axios.post('/api/addreferral', {
        email1: useremail,
        email2: refemail
    }).then((response) => {
        // console.log('xxxxx',response)
        if (response.data.status) {
            console.log(response.data.status)
            swal({
                    title: "Success",
                    text: response.data.msg,
                    type: 'info',
                    allowOutsideClick: true,
                    html: true

                },
                function() {
                    location.replace('/adminpage');
                });
        } else {
            swal({
                title: "Error",
                text: response.data.msg,
                type: 'warning',
                allowOutsideClick: true,
                html: true
            })
        }
    }).catch((error) => {
        console.log(error);
    })
}

function update() {
    var email = document.getElementById("Email1").innerText
    // var update = document.getElementById("update").value
    // console.log('ssssssss',update)
    axios.post('/api/updatestatus', {
        email: email,
        "status.active": "true"
    }).then((response) => {
        console.log('xxxxx',response)
        if (response.data.status) {
            // console.log('vvvvv',response.data.status)
            swal({
                    title: "Success",
                    text: response.data.msg,
                    type: 'info',
                    allowOutsideClick: true,
                    html: true

                },
                function() {
                    location.replace('/adminpage');
                });

        } else {
            //  alert(response.data.message);
            swal({
                title: "Error",
                text: response.data.msg,
                type: 'warning',
                allowOutsideClick: true,
                html: true
            })
        }
    }).catch((e) => {
        console.log(e)
    })
}

function ban() {
    var email = document.getElementById("Email1").innerText
    // console.log('ssssssss',email)
    axios.post('/api/banuser', {
        email: email,
        "status.ban": "true"
    }).then((response) => {
        // console.log('xxxxx',response)
        if (response.data.status) {
            // console.log('vvvvv',response.data.status)
            swal({
                    title: "Success",
                    text: response.data.msg,
                    type: 'info',
                    allowOutsideClick: true,
                    html: true

                },
                function() {
                    location.replace('/adminpage');
                });
        }
        else 
        {
            swal({
                title: "Error",
                text: response.data.msg,
                type: 'warning',
                allowOutsideClick: true,
                html: true
            })
        }
    }).catch((e) => {
        console.log(e)
    })
}

function unban() {
    var email = document.getElementById("Email1").innerText
    // console.log('ssssssss',email)
    axios.post('/api/unbanuser', {
        email: email,
        "status.ban": "false"
    }).then((response) => {
        // console.log('xxxxx',response)
        // console.log('AAAAAAAAAAAAAAAAAAAAAa',response.data)
        if (response.data.status) {
            // console.log('vvvvv',response.data)
            swal({
                    title: "Success",
                    text: response.data.msg,
                    type: 'info',
                    allowOutsideClick: true,
                    html: true
                },
                function() {
                    location.replace('/adminpage');
                });

        } else {
            //  alert(response.data.message);
            swal({
                title: "Error",
                text: response.data.msg,
                type: 'error',
                allowOutsideClick: true,
                html: true
            })

        }
    }).catch((e) => {
        console.log(e)
    })
}

function refree() {
    axios.post('/api/fetchrefree', {
        id: getUrlVars()['id']
    }).then(function(response) {
        //  console.log('uuuuuuuu', response)
        var data = response.data.response
        // console.log(refree)
        document.getElementById("ref").innerText = data;
    })
}