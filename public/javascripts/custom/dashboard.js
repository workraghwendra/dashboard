

$(document).ready(function () {
    // var tokenUSDEx = document.getElementById('valueoftoken').innerText;
    var tokenUSDEx = 1;
    currency = "BTC";
    $('#amountinbtccurrency').on('keyup', function (e) {
        e.preventDefault();
        var inV = $(this).val();
        var tokenQuantity = "";
        tokenQuantity = (inV * btcUSDEx) / tokenUSDEx;
        $('#tokenamountinbtc').val(tokenQuantity);
    });

    $('#tokenamountinbtc').on('keyup', function (e) {
        e.preventDefault();
        // var tokenUSDEx = document.getElementById('valueoftoken').innerText;
        var inV = $(this).val();
        var maincurrency = "";
        maincurrency = (inV * tokenUSDEx) / btcUSDEx;
        $('#amountinbtccurrency').val(maincurrency);
    });
})


$(document).ready(function () {
    var tokenUSDEx = 1;
    // var tokenUSDEx = document.getElementById('valueoftoken').innerText;
    currency = "ETH";
    $('#amountinethcurrency').on('keyup', function (e) {
        e.preventDefault();
        var inV = $(this).val();
        var tokenQuantity = "";
        tokenQuantity = (inV * ethUSDEx) / tokenUSDEx;
       // console.log(tokenQuantity)
        $('#tokenamountineth').val(tokenQuantity);
    });

    $('#tokenamountineth').on('keyup', function (e) {
        e.preventDefault();

        var inV = $(this).val();
        var maincurrency = "";
        maincurrency = (inV * tokenUSDEx) / ethUSDEx;
        $('#amountinethcurrency').val(maincurrency);
    });
})


$(document).ready(function () {
    // var tokenUSDEx = document.getElementById('valueoftoken').innerText;
    var tokenUSDEx = 1;
    // currency="USD";
    $('#amountinusdcurrency').on('keyup', function (e) {
        e.preventDefault();
        var inV = $(this).val();
        var tokenQuantity = "";
        tokenQuantity = inV / tokenUSDEx;
        $('#tokenamountinusd').val(tokenQuantity);
    });

    $('#tokenamountinusd').on('keyup', function (e) {
        e.preventDefault();
        var inV = $(this).val();
        var maincurrency = "";
        maincurrency = inV * tokenUSDEx;
        $('#amountinusdcurrency').val(maincurrency);
    });
})


function btcpurchasefunction() {
    var btcamount = document.getElementById("amountinbtccurrency").value;
    var amount = document.getElementById("tokenamountinbtc").value;
    if (amount == '') {
         return false;
    }
    else if(amount == 0){
        swal({
            title: 'Insufficient Amount',
            text: "BTC amount must be greater than 0.001 BTC",
            type: 'info',
          })
         return false;
    }
    else if(btcamount < 0.001){
        swal({
            title: 'Insufficient Amount',
            text: "BTC amount must be greater than 0.001 BTC",
            type: 'warning',
          })
         return false;
    }
    else if(amount < 1){
        swal({
            title: 'Insufficient Amount',
            text: "ENM Amount must be greater than 1 ENM",
            type: 'warning',
          })
        return false;
    }
    else {
        $(document).ready(function(){
            $("#btchiddenbutton").addClass("loader");
    })
        document.getElementById('btcpurchasebutton').hidden=true;
        document.getElementById("btcpurchasebutton").disabled = true;

        axios.post('/api/purchaseCurr', {
            currency: 'BTC',
            tokenamount: amount,
            currencyamount: btcamount
        }).then((response) => {
            console.log(response)
                if (response.data.status) {
                    document.getElementById("btcpurchasebutton").disabled = false;
                    $('#btcpurchasebutton').html('Purchase');
                    var conReu = response.data.result;
                    console.log(conReu.address, conReu.txn_id, conReu.confirms_needed);
                     $('#payConfModal').modal('toggle');
                    $("#btchiddenbutton").removeClass("loader");
                    $("#imageQrCode").attr("src", conReu.qrcode_url);
                    document.getElementById("amount-to-be-paid").innerHTML = `${conReu.amount}&nbsp;${response.data.currency}`;
                    document.getElementById("payment-address").innerHTML = conReu.address;
                    document.getElementById("transaction-id").innerHTML = conReu.txn_id;
                    document.getElementById("confirm").innerHTML = conReu.confirms_needed;
                    document.getElementById('btcpurchasebutton').hidden=false;
                    // //console.log()
                } else {
                    if(response.data.limit){
                        $("#btchiddenbutton").removeClass("loader");
                        swal({
                            title: 'Pending Transactions',
                            text: "2 transactions are already pending",
                            type: 'info',
                          })
                    document.getElementById('btcpurchasebutton').hidden=false;
                     
                    document.getElementById("btcpurchasebutton").disabled = false;
                    console.log("2 transactions are already pending");
                    }
					else{
                        $("#btchiddenbutton").removeClass("loader");
                        swal({
                            title: 'Transaction Failed',
                            text: `${response.data.mess}`,
                            type: 'info',
                          })
                    document.getElementById('btcpurchasebutton').hidden=false;                     
                    document.getElementById("btcpurchasebutton").disabled = false;
                    console.log(response.data.error);
                }
                }
            }).catch((e) => {
                console.log(e);
            })
    }
};


function ethpurchasefunction() {
    var ethamount = document.getElementById("amountinethcurrency").value;
    var amount = document.getElementById("tokenamountineth").value;
    if (amount == '') {
        return false;
    }
    else if(amount == 0){
        swal({
            title: 'Insufficient Amount',
            text: "ETH amount must be greater than 0.01 ETH",
            type: 'warning',
          })
        return false;
    }
    else if(ethamount < 0.01){

        swal({
            title: 'Insufficient Amount',
            text: "ETH amount must be greater than 0.01 ETH",
            type: 'warning',
          })
         return false;
    }
    else if(amount < 1){

        swal({
            title: 'Insufficient Amount',
            text: "ENM Amount must be greater than 1 ENM",
            type: 'warning',
          })
        return false;
    }
    else {
        $(document).ready(function(){
            $("#ethhiddenbutton").addClass("loader");
    })
    document.getElementById('ethpurchasebutton').hidden=true;
        document.getElementById("ethpurchasebutton").disabled = true;
      //   console.log(tokenPrice);
        axios.post('/api/purchaseCurr', {
            currency: 'ETH',
            currencyamount: ethamount,
            tokenamount: amount
        })
            .then((response) => {
                //console.log("Response",response);
                if (response.data.status) {
                    // console.log(response.data.status);
                    document.getElementById("ethpurchasebutton").disabled = false;
                    // console.log(response.data.mess);
                    $('#ethpurchasebutton').html('Purchase');
                    var conReu = response.data.result;
                    console.log(conReu.address, conReu.txn_id, conReu.confirms_needed);
                    $('#payConfModal').modal('toggle');
                    $("#ethhiddenbutton").removeClass("loader");
                    $("#imageQrCode").attr("src", conReu.qrcode_url);
                    document.getElementById("amount-to-be-paid").innerHTML = `${conReu.amount}&nbsp;${response.data.currency}`;
                    document.getElementById("payment-address").innerHTML = conReu.address;
                    document.getElementById("transaction-id").innerHTML = conReu.txn_id;
                    document.getElementById("confirm").innerHTML = conReu.confirms_needed;
                    document.getElementById('ethpurchasebutton').hidden=false;
                    //console.log()
                } else {
                    if(response.data.limit){
                        $("#ethhiddenbutton").removeClass("loader");
                        swal({
                            title: 'Pending Transactions',
                            text: "2 transactions are already pending",
                            type: 'warning',
                          })
                    document.getElementById('ethpurchasebutton').hidden=false;      
                    document.getElementById("ethpurchasebutton").disabled = false;
                    console.log("2 transactions are already pending");
                    }
					else{
                        $("#ethhiddenbutton").removeClass("loader");
                        swal({
                            title: 'Transaction Failed',
                            text: `${response.data.mess}`,
                            type: 'info',
                          })
                    document.getElementById('ethpurchasebutton').hidden=false;                     
                    document.getElementById("ethpurchasebutton").disabled = false;
                    console.log(response.data.error);
                }
            }
            }).catch((e) => {
                console.log(e);
            })
    }
};

// function usdpurchasefunction() {
//     var amount = document.getElementById("amountinusdcurrency").value;
//     if(amount<5)
//     {
//         swal({
//             title: 'Insufficient amount',
//             text: `Payment amount must be greater than $5`,
//             type: 'warning',
//           })
//     }
//     else{
//         document.getElementById("usdvalue").innerHTML = amount;
//         $('#cardpayment').modal('toggle');
//         setTimeout(function(){
//             $('#cardpayment').modal('toggle');
//         notable();}, 15000);
            
//         $("#paywithcard").html(`<form action="/api/payment" method="POST">
//         <script src="https://checkout.stripe.com/checkout.js" 
//         class="stripe-button" 
//         data-key="pk_test_7aJaNe5cw6i1Q1mYZL9vcal4" 
//         data-amount=${amount * 100}
//         data-name="Stripe.com" 
//         data-description="Widget"
//         data-image="https://stripe.com/img/documentation/checkout/marketplace.png"
//         data-locale="auto">
//         </script>
//         <input id='usd' name="usd" type="hidden" value=${amount}>
//         </form>`);
//     }
// }

function tokensold() {
    axios.get('/api/admindetails').then((response) => {
        if (response.data.status) {
            document.getElementById("totaltokensold").innerHTML = response.data.totalToken;
            document.getElementById("totalusers").innerHTML = response.data.totalUser;
            document.getElementById("usdraised").innerHTML = response.data.totalTokenWorth;
        }
    })
}

function notable() {
    document.getElementById("btcpurchasebutton").disable = true;
    document.getElementById("ethpurchasebutton").disable = true;
    document.getElementById("amountinethcurrency").value = '';
    document.getElementById("tokenamountineth").value = '';
    document.getElementById("tokenamountinbtc").value = '';
    document.getElementById("amountinbtccurrency").value = '';
}