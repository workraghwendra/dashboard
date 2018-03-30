$(function(){
    fetchDashboard3();
 })
  
 function fetchDashboard3() {
    axios.get('/api/fetchtotalsoldtoken', {

    }).then((response)=>{
//console.log(response)
var data= response.data.response
var usd = data*0.5
//console.log(usd)
// console.log(data)

document.getElementById("totalsoldtoken").innerHTML = data.toFixed(3);


    })
 }

 $(function(){
    fetchDashboard4();
 })
  
 function fetchDashboard4() {
    axios.get('/api/fetchtotaltoken', {

    }).then((response)=>{
//console.log(response)
var data= response.data.response
// console.log(data)

document.getElementById("totaltokencount").innerHTML = data.toFixed(3);
    })
 }

 $(function(){
    fetchDashboard5();
 })
  
 function fetchDashboard5() {
    axios.get('/api/fetchreferredtoken', {

    }).then((response)=>{
//console.log(response)
var data= response.data.response
//console.log(data)

document.getElementById("totalrefer").innerHTML = data.toFixed(3);
    })
 }

 $(function(){
    fetchDashboard8();
 })
  
 function fetchDashboard8() {
    axios.get('/api/fetchadmintoken', {

    }).then((response)=>{
//console.log(response)
var data= response.data.response
console.log("!!!!!!!!!!!!!!!!!11",data)

document.getElementById("tokenbyadmin").innerHTML = data;
    })
 }