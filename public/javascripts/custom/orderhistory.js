function fetchOrHis(){
	var html = '';
	axios.get('/api/fetchOrHis')
		.then((response) => {
        //    console.log(response)
			var data = response.data.orderHistory;
			if (response.data.status && data.length > 0 ) {
				//console.log(data.length)
                var b = data.sort(function(a,b){  return b.time_created - a.time_created;});
            //    console.log(e)
				b.forEach(function(e,i) {
                    //  console.log(e)					
                    // console.log(i)
                    var f= e[1]
					//  console.log('kkkk',f)
                    var d = new Date(f*1000).toLocaleString();
                    // console.log(d)
                //   console.log(e[9])
                //    console.log('d',e[8])
						var created = '';
						var callNow = '';
						switch (e[8]) {
						    case 0:
						        created = `<span class="label label-info"><font color="red">Pending</span>`;
						 		callNow = `<span class="close-link text-danger CanOrBtn" data-oid=${e[9]} ><i class="fa fa-close fa-2x" title='Cancel Now'></i></span>`;

						        break;
						    case 100:
						        created = `<span class="label label-success"><font color="red">Success</span>`;
						 		callNow = `<span class="close-link text-success">--</span>`;
						        break;
						    case -1:
						        created = `<span class="label label-danger"><font color="red">Cancelled</span>`;
						 		callNow = `<span class="close-link">--</span>`;
						        break;
                        }
                    //    console.log('ffff',e)
                       html+=` <tr>
                       <td>${i+1}</td>
                       <td>${(new Date(f*1000)).toLocaleString()}</td>
                       <td>${e[5]}</td>
                       <td>${e[2]}<br> <font color="brown"> ${e[6]}</font></td>
                       <td>${e[3]}<br> <font color="red"> ${e[6]}</font></td>
                       <td><b>TrxID</b></br> ${e[10]}<br/><b>Address</b></br>${e[4]}</td>
                       <td>${e[7]?new Date((e[7]*1000)).toLocaleString():"<span class='close-link text-success'>--</span>"}</td>
                       <td>${callNow}</td>
                       <td>${created}</td>
                       </tr>`;
				});
				$('#orderHisTableBody').html(html);
				canOrder();
			}else{
				$('#orderHisTableBody').html('<tr><td colspan="9">No data found</td></tr>');
			// }
		}})
}


function canOrder () {
	$('.CanOrBtn').on('click',function(e){
		e.preventDefault();
		console.log(e)
		oid = $(this).data('oid');
		console.log("oid",oid)
		
		swal({
		  title: "Are you sure?",
		  text: "Are you sure that you want to cancel order",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonClass: "btn-primary2",
		  confirmButtonText: "Yes, delete it!",
		  cancelButtonClass: "btn-primary2",
		  cancelButtonText: "No",
		  closeOnConfirm: false,
		  closeOnCancel: false
		},
		
		function(isConfirm) 
		{
			
		  if (isConfirm) {
			axios.post('/api/canOrd',{oid:oid})
				.then((response) => {
					console.log('ggggggg',response)
				if(response.status)
				{		
	    			swal({
		    				title:"Deleted!",
		    				text:"Your order has been cancel.",
		    				type: "success"
	    				},
	    			     function(){
		  					location.reload();
	    				}
	    			);
				}else{
	    			swal("Warning!",response.mess, "danger");
				}
			})
		  } else {
		    swal("Cancelled", "Your order is safe", "error");
		  }
		});
	})
}