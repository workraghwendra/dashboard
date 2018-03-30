function referalcoins(){

    axios.post('/api/userCoinData',{
    }).then((response)=>{
        if(response.status){
            console.log(response);
        }
    })
}
