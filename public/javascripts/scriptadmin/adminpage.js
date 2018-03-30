$(function(){
    fetchDashboard2();
 })
  
 function fetchDashboard2() {
    axios.get('/api/fetchactiveuser', {

    }).then((response)=>{
// console.log(response)
var data= response.data.response
// console.log(data)

document.getElementById("totalactiveuser").innerHTML = data;
    })
 }



 $(function(){
    fetchDashboard1();
 })

 function fetchDashboard1() {
    axios.get('/api/fetchinactiveuser', {

    }).then((response)=>{
console.log(response)
var data= response.data.response
console.log(data)

document.getElementById("totalinactiveuser").innerHTML = data;
    })
 }


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
    fetchDashboard14();
 })
  
 function fetchDashboard14() {
    axios.get('/api/fetch24', {

    }).then((response)=>{
//console.log(response)
var data= response.data.response
//console.log(data)

document.getElementById("24hrs").innerHTML = data;
    })
 }
 