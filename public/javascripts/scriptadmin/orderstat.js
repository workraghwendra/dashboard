$(function(){
    fetchDashboard6();
 })
  
 function fetchDashboard6() {
    axios.get('/api/fetchlast', {

    }).then((response)=>{
//console.log(response)
var data= response.data.response
//console.log(data)

document.getElementById("orders").innerHTML = data;
    })
 }


 $(function(){
    fetchDashboard7();
 })
  
 function fetchDashboard7() {
    axios.get('/api/fetchlast1', {

    }).then((response)=>{
//console.log(response)
var data= response.data.response
//console.log(data)

document.getElementById("orders1").innerHTML = data;
    })
 }

 



 $(function(){
    fetchDashboard9();
 })
  
 function fetchDashboard9() {
    axios.get('/api/fetchlast2', {

    }).then((response)=>{
//console.log(response)
var data= response.data.response
//console.log(data)

document.getElementById("totalorder").innerHTML = data;
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
    fetchDashboard12();
 })
  
 function fetchDashboard12() {
    axios.get('/api/fetchlast5', {

    }).then((response)=>{
//console.log(response)
var data= response.data.response
//console.log(data)

document.getElementById("odes").innerHTML = data;
    })
 }






 $(function(){
    fetchDashboard11();
 })
  
 function fetchDashboard11() {
    axios.get('/api/fetchlast4', {

    }).then((response)=>{
//console.log(response)
var data= response.data.response
//console.log(data)

document.getElementById("ode").innerHTML = data;
    })
 }


