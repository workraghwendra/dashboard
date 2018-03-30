$(function(){
    fetchDashboard();
 })
  
 function fetchDashboard() {
    axios.get('/api/fetchalluser', {

    }).then((response)=>{
//console.log(response)
var data= response.data.response
//console.log(data)

document.getElementById("totaluser").innerHTML = data;
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
    fetchDashboard10();
 })
  
 function fetchDashboard10() {
    axios.get('/api/fetchlast3', {

    }).then((response)=>{
//console.log(response)
var data= response.data.response
//console.log(data)

document.getElementById("od").innerHTML = data;
    })
 }


 $(function(){
    fetchDashboard3();
 })
  
 function fetchDashboard3() {
    axios.get('/api/fetchtotaltoken', {

    }).then((response)=>{
// console.log(response)
var data= response.data.response
data = data.toFixed(3)
var a= (data*0.5).toFixed(3);
var usd ='$ '+ a
// console.log(usd)
// console.log(a)
// console.log(data)
document.getElementById("usd").innerHTML = usd;

    })
 }