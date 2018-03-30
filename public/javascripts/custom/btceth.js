var btcUSDEx="",ethUSDEx="";

function getBtcUsd() {
	axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
	.then((response) => {
		if (response) {
        btcUSDEx=response.data.BTC.USD;
        }else{
			console.log("Error In Connection");
        }
	})
	.catch((err) => {
		console.log(err);
	})
}

function getEthUsd() {
	axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH&tsyms=USD')
	.then((response) => {
		if (response) {
        ethUSDEx=response.data.ETH.USD;    
        }else{
			console.log("Error In Connection");            
        }
	})
	.catch((err) => {
		console.log(err);
	})
}