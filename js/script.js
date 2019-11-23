
var $user = "";


$( document ).ready(function() {

validateUser()
calculateWeddingCountdown();

$("#enterbtn").click(function(){

	onFormSubmit();
})

});


function onFormSubmit(){
		if(validateForm()){
		createCookie("mmWeddingUser", $user);
		showContentImmediately();
	}
	else{
		blankFields();
		showError();
	}
}



function validateForm(){

	$user = $("#nameInput").val();
	var code = $("#codeInput").val().toLowerCase();
	
	if($user == null || $user === ""){
		return false
	}
	
	if(code == "2bmccabe"){
		return true 
	}
	
	return false;
}

function blankFields(){
	$user = "";
	$("#loginForm").trigger("reset");
	
	
}

function showError(){
	$("#myToast").toast('show');
}




function validateUser(){
	var cookie = readCookie("mmWeddingUser");

	if(cookie != null){
		$user = cookie;
		showContentImmediately();
		console.log('Cookie found for user' + $user)
	}
	else{
		console.log("no cookie");
		showLogin();
	}
}




function calculateWeddingCountdown(){
    
    //Get today's date.
    var now = new Date();
 
 
    var dueDate =  new Date("2020-09-11T12:30:00");

 
    //Get the difference in seconds between the two days.
    var diffSeconds = Math.floor((dueDate.getTime() - now.getTime()) / 1000);
 
    var days = 0;
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
 

        //Convert these seconds into days, hours, minutes, seconds.
        days = Math.floor(diffSeconds / (3600*24));
        diffSeconds  -= days * 3600 * 24;
        hours   = Math.floor(diffSeconds / 3600);
        diffSeconds  -= hours * 3600;
        minutes = Math.floor(diffSeconds / 60);
        diffSeconds  -= minutes * 60;
        seconds = diffSeconds;
    

    
	  $("#day").text(days);
	  $("#hour").html(hours);
	  $("#min").html(minutes);
	  $("#sec").html(seconds);
	 
    //Recursive call after 1 second using setTimeout
    setTimeout(calculateWeddingCountdown, 1000);
}

function showContent(){
	
		$("#content").show();
		$("#access").slideUp();
	
}

function showContentImmediately(){
	
		$("#content").show();
		$("#access").hide();
	
}

function showLogin(){
		$("#access").show();
		$("#content").hide();
}

function createCookie(key, value) {
    let cookie = escape(key) + "=" + escape(value) + ";SameSite=Strict; Secure";
    document.cookie = cookie;
    console.log(cookie);
    console.log("Creating new cookie with key: " + key + "; value: " + value + ";  ");
}

function readCookie(name) {
	let key = name + "=";
	let cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
		
		let cookie = cookies[i];
		console.log(cookie);
		while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
		if (cookie.indexOf(key) === 0) {
            return cookie.substring(key.length, cookie.length);
        }
	}
	return null;
}







