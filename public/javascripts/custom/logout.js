function logout(){
	axios.get('/api/logout', {
		})
		.then((response) => {
            location.replace('/');
            localStorage.setItem("jwtToken","");
		})
	.catch((err) => {
	});
}