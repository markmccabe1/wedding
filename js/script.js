
var $user = "";
var $validationMessage = "";
var loadCounter = 0;
var db = null;
var attendee = null;
var attendees = [];

$( document ).ready(function() {

	checkExistingSession()
	calculateWeddingCountdown();
	
	$("#enterbtn").click(function(){
		$("#spinner").show();
		onFormSubmit();
	});
	
	$("#signOutButton").click(function(){
		removeAttendee();
		blankFields();
		showLogin();
		showToast("Logged Out");
	});

	db = new restdb("60834b7328bf9b609975a5f9", null);
	getUsers();
});


function getUsers(){
	console.log("getUsers()");
	var query = {}; // get all records
	var hints = {"$max": 10, "$orderby": {"_id": -1}}; // top ten, sort by creation id in descending order
	db.attendee.find(query, hints, function(err, res){
	  if (!err){
	    console.log(res);
	    console.log("users retrieved");
	    attendees = res;
	  }else{
	  	console.log("users not retrieved");
	  }
	});

}


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
		findUser();
	}
	else{
		blankFields();
		showToast($validationMessage + ". Please try again");
	}
}



function validateForm(){
	$validationMessage = "";

	var forename = $("#forenameInput").val();
	var surname = $("#surnameInput").val();

	$user = forename + " " + surname;
	var code = $("#codeInput").val().toLowerCase();
	
	if(isInvalidString(forename)){
		$validationMessage = "Invalid Forename";
		return false;
	}

	if(isInvalidString(surname)){
		$validationMessage = "Invalid Surname";
		return false;
	}
	
	if(isInvalidString(code)){
		$validationMessage = "Invalid Code";
		return false;
	}
	
	if($user == null || $user === ""){
		$validationMessage = "Invalid Name";
		return false;
	}

	if(code == "2bmccabe"){
		return true;
	}

	$validationMessage = "Invalid Code";
	return false;
}

function findUser(){
	
	var nameArray = $user.split(" ");
	var forename = nameArray[0];
	var surname = nameArray[1];


	console.log("getUser" + forename + surname);
	var result = false;
	var query = {"forname" : forename, "surname": surname}; // get all records
	var hints = {"$max": 10, "$orderby": {"_id": -1}}; // top ten, sort by creation id in descending order
	db.attendee.find(query, hints, function(err, res){
	  if (!err){
	  	attendee = res[0];

	  	if(attendee != null){
	  		console.log("creating cookie" + forename + surname);

	  		setAttendee();
			showContentImmediately();

	  		if(attendee['attending'] == ""){
	  			showBodyToast("You're Invited. Please RSVP below");
		  	}
		  	if (attendee['attending'] == "Yes"){
		  		showBodyToast("Thanks for RSVP'ing.");
		  	}
	  	}
	  	else{
	  		showBodyToast("Can't find "+ $user +".");
	  		blankFields();
	  	}

	  }
	  else{
	  	console.log(err);
	  }
	});
}



function blankFields(){
	$user = "";
	$("#loginForm").trigger("reset");
	$("#spinner").hide();
    $validationMessage = "";
	loadCounter = 0;
	attendee = null;
	
	
}

function showToast(message){
	
	//var html = "<div><br><p>&nbsp;&nbsp;"+message+"&nbsp;&nbsp;</p></div>";
	var html = "<div><center><p>&nbsp;&nbsp;"+message+"&nbsp;&nbsp;</p></center></div>";

	
	
	$("#myToast").html(html);
	$("#myToast").toast('show');
}

function showBodyToast(message){

		var html = "<div><center><p>&nbsp;&nbsp;"+message+"&nbsp;&nbsp;</p></center></div>";
	
	
	$("#myBodyToast").html(html);
	$("#myBodyToast").toast('show');

}




function checkExistingSession(){

	var forename = localStorage.getItem('forename');
	var surname = localStorage.getItem('surname');
	attendee = localStorage.getItem('attendee');

	if(forename != null && surname != null){
		$user = forename+" " + surname;
		//refresh();
		//findUser();
		showContentImmediately();
	}
	else{

			showLogin();
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
		
		$("#spinner").hide();
		$("#access").show();
		$("#content").hide();
}

function setAttendee(){
	console.log("adding attendee to local storage");
	localStorage.setItem('forename', attendee['forname']);
	localStorage.setItem('surname', attendee['surname']);
	localStorage.setItem('attendee', JSON.stringify(attendee));
}

function removeAttendee(){
	console.log("removing from local storage");
	localStorage.clear();

}

















