
var $user = "";
var loadCounter = 0;

$( document ).ready(function() {

	validateUser()
	calculateWeddingCountdown();
	
	$("#enterbtn").click(function(){
	
		onFormSubmit();
	});
	
	$("#signOutButton").click(function(){
		removeCookie("mmWeddingUser");
		blankFields();
		showLogin();
		showToast("Logged Out");
	});

});

function sanitizeString(str){
    str = str.replace(/[^a-z0-9‡Ž’—œ–Ÿ \.,_-]/gim,"");
    return str.trim();
}

function isInvalidString(str){
	  var letters = /^[0-9a-zA-Z]+$/;
	  if (letters.test(str)) {
	    return false;
	  } else {
	    return true;
	  }
}



function onFormSubmit(){
	if(validateForm()){
		createCookie("mmWeddingUser", $user);
		showContentImmediately();
		showToast("Welcome " + $user);
	}
	else{
		blankFields();
		showToast("Incorrect Name/Code. Please try again");
	}
}



function validateForm(){

	$user = $("#nameInput").val();
	var code = $("#codeInput").val().toLowerCase();
	
	if(isInvalidString($user)){
		return false;
	}
	
	if(isInvalidString(code)){
		return false;
	}
	
	if($user == null || $user === ""){
		return false;
	}
	
	if(code == "2bmccabe"){
		return true;
	}
	
	return false;
}

function blankFields(){
	$user = "";
	$("#loginForm").trigger("reset");
	
	
}

function showToast(message){
	
	var html = "<div><br><p>&nbsp;&nbsp;"+message+"&nbsp;&nbsp;</p></div>";
	
	
	$("#myToast").html(html);
	$("#myToast").toast('show');
}




function validateUser(){
	var cookie = readCookie("mmWeddingUser");
	var queryString = window.location.href;

	if(cookie != null){
		$user = cookie;
		showContentImmediately();
	}
	else{
		if(queryString.includes("test")){
			showContentImmediately();
		}
		else{
					showLogin();
		}
	}
}




function calculateWeddingCountdown(){
    
    //Get today's date.
    var now = new Date();
 
 
    var dueDate =  new Date("2021-07-15T12:30:00");

 
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
		$("#userDisplay").text("Hi " + $user);
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
}

function readCookie(name) {
	let key = name + "=";
	let cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
		
		let cookie = cookies[i];
		while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
		if (cookie.indexOf(key) === 0) {
            return cookie.substring(key.length, cookie.length);
        }
	}
	return null;
}

function removeCookie(name){
	
	document.cookie = name+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=Strict; Secure";

}


    






