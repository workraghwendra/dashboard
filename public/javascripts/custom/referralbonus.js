function refList(){
    var html = '';
        axios.get('/api/refList')
            .then((response) => {
                // console.log(response.data.result)
                // console.log(response.data.result[35][4])
                
    // var response.data.result = response.response.data.result.result;
    // if(response.data.status){
    // console.log(response.data.result);
    // var l = response.data.result.length;
    // for(var i=0;i<l;i++){
    //     var percent = 20-((response.data.result[i].level-1)*5);
    if(response.data.status){
        var l = response.data.result.length;
        for(var i=0;i<l;i++){
            // console.log(response.data.result[i])
            // console.log("h")
        var n = response.data.result[i][0];
        // console.log(response.data.result[i][3])
        var percent = 0;
        if(n == 1){
        percent = 15;
        }
        else if(n == 2){
        percent = 10;
        }
        else if(n == 3){
        percent = 5;
        }
        else if(n == 4){
        percent = 2.5;
        }
        // console.log()
    html+= `<tr>
    <td>${i+1}</td>
    <td>${(new Date(response.data.result[i][3]*1000)).toLocaleString()}</td>
    <td>${response.data.result[i][2]}</td>
    <td>${response.data.result[i][0]}</td>
    <td>${percent}</td>
    <td>${response.data.result[i][4]}</td>
    </tr>`
    }
    document.getElementById('tableReferral').innerHTML = html;
    }
    }).catch((e)=>{
    console.log(e);
    })
    }