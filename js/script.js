
var $user = "";
var $validationMessage = "";
var loadCounter = 0;
var db = null;
var attendee = null;
var attendees = [];
var userGroup = [];

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

	getUsers();
	//createDummyData();
});


function getUsers(){
	console.log("getUsers()");
	var query = {}; // get all records
	var hints = {"$max": 10, "$orderby": {"_id": -1}}; // top ten, sort by creation id in descending order
	db = new restdb("60834b7328bf9b609975a5f9", null);
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

	var query = {"forname" : forename, "surname": surname}; // get all records
	var hints = {"$max": 10, "$orderby": {"_id": -1}}; // top ten, sort by creation id in descending order
	db = new restdb("60834b7328bf9b609975a5f9", null);
	db.attendee.find(query, hints, function(err, res){
	  if (!err){
	  	attendee = res[0];
	  	console.log("new attendee");
	  	console.log(attendee);


	  	if(attendee != null){
	  		setAttendee();
			showContentImmediately();
			getUserGroup();

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

function getUserGroup(){
	userGroup = [];

	if(attendee == null){
		console.log("attendee null");
		return;
	}
	var group = attendee['group'];
	console.log(group);

	if(group == ""){
		userGroup = [attendee];
		console.log(userGroup);
		generateRSVP();
	}
	else{
		var query = {"group" : group}; // get all records

		var hints = {"$max": 10, "$orderby": {"_id": -1}}; // top ten, sort by creation id in descending order
		db = new restdb("60834b7328bf9b609975a5f9", null);
		db.attendee.find(query, hints, function(err, res){
		  if (!err){
		  		userGroup = res;
		  		generateRSVP();
		  	}
		  });
		}

	
}

$(document).on("change", ".attendingSelect", function() {

  var attendingInput = $(this).val();

  var form = $(this).closest("form").attr('id');

  var formButton = "#" + form.replace("Form", "Submit");
  var hiddenFormItems = "#" + form.replace("Form", "Items");

  console.log(formButton + hiddenFormItems);


		if(attendingInput === "Yes"){
			$(hiddenFormItems).show();
			$(formButton).prop("disabled", false);
		}

		if(attendingInput === "No"){
			$(hiddenFormItems).hide();
			$(formButton).prop("disabled", false);
		}

		if(attendingInput === ""){
			$(hiddenFormItems).hide();
			$(formButton).prop("disabled", true);
		}
});



function blankFields(){
	$user = "";
	$("#loginForm").trigger("reset");
	$("#spinner").hide();
    $validationMessage = "";
	loadCounter = 0;
	attendee = null;
	$("#dynamicInput").empty();
	
	
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
	var tempAttendee = localStorage.getItem('attendee');

	if(forename != null && surname != null){
		$user = forename+" " + surname;
		attendee = JSON.parse(tempAttendee);
		showContentImmediately();
		getUserGroup();
	}
	else{

			showLogin();
	}
}

function generateRSVP(){

	var group = userGroup;
	console.log("generateRSVP");
	console.log(group);

	if(group != null){
		console.log("group is not null");

		var i = 0;

		for(i;i<group.length; i++){
			var a = group[i];
			console.log("found group member");
			console.log(a);

			if(a['attending'] === "Yes"){
				$("#dynamicInput").append(createAttending(a['forname'], a['surname'], a['starter'], a['main'], a['allergies']));
				console.log("yes");
			}
			if(a['attending'] === "No"){
				$("#dynamicInput").append(createNotAttending(a['forname'], a['surname']));
				console.log("Not");
			}
			if(a['attending'] === ""){
				$("#dynamicInput").append(createForm(a['forname'], a['surname']));
				console.log("reply");
			}

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
		$(".hiddenFormItems").hide();
		
	
}

function showLogin(){
		
		$("#spinner").hide();
		$("#access").show();
		$("#content").hide();
}

function setAttendee(){
	localStorage.setItem('forename', attendee['forname']);
	localStorage.setItem('surname', attendee['surname']);
	localStorage.setItem('attendee', JSON.stringify(attendee));
}

function removeAttendee(){
	attendee = null;
	localStorage.clear();
	$("#dynamicInput").empty();

}

function createDummyData(){

	$("#accordian").append(createForm("Mark", "McCabe"))
	$("#accordian").append(createAttending("Maeve", "Diamond", "Soup", "Beef", "None"));
	$("#accordian").append(createNotAttending("Michael", "McCabe"));
}

function createForm(forename, surname){

    var form = $("#ReplyCard").html();


    var replacementDiv = forename+"-"+surname+"Form";
    var replacementForm = forename+"-"+surname+"Form";
	var replacementBtn = forename+"-"+surname+"Submit";
	var replacementItems = forename+"-"+surname+"Items";


    form = form.replace("$name$", forename + " " + surname);
    form = form.replace("$divName$", replacementDiv);
    form = form.replace("$formName$", replacementForm);
	form = form.replace("$formSubmitBtn$", replacementBtn);
	form = form.replace("$hiddenFormItems$", replacementItems);

	return form;

}

function createAttending(forename, surname, starter, main, allergy){
	var attending = $("#AttendingCard").html();


    var replacementDiv = forename+"-"+surname+"Div";

    attending = attending.replace("$name$", forename + " " + surname);
    attending = attending.replace("$divName$", replacementDiv);
    attending = attending.replace("$divName$", replacementDiv);
    attending = attending.replace("$starterVal$", starter);
	attending = attending.replace("$mainVal$", main);
	attending = attending.replace("$allergyVal$", allergy);

	return attending;

}

function createNotAttending(forename, surname){
	var notAttending = $("#NotAttendingCard").html();

	notAttending = notAttending.replace("$name$", forename + " " + surname);

	return notAttending;
}


$(document).on("click", ".clickable", function() {
	var collapsed = $(this).data('target');

	var collapsedDiv = "#"+ collapsed;

	console.log(collapsedDiv);

	$(collapsedDiv).collapse('toggle');
 });












