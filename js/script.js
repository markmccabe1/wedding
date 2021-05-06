
var $user = "";
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

	//getUsers();
	//createDummyData();
});


function getUsers(){
	console.log("getUsers()");
	var query = {}; // get all records
	var hints = {"$max": 130, "$orderby": {"_id": -1}}; // top ten, sort by creation id in descending order
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
    str = str.replace(/[^a-z0-9������� \.,_-]/gim,"");
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
	}
}



function validateForm(){

	var forename = $("#forenameInput").val();
	var surname = $("#surnameInput").val();

	$user = forename + " " + surname;
	var code = $("#codeInput").val().toLowerCase();
	
	if(isInvalidString(forename)){
		showToast("Invalid Forename. Please try again");
		return false;
	}

	if(isInvalidString(surname)){
		showToast("Invalid Surname. Please try again");
		return false;
	}
	
	if(isInvalidString(code)){
		showToast("Invalid Code. Please try again");
		return false;
	}
	
	if($user == null || $user === ""){
		showToast("Invalid Name. Please try again");
		return false;
	}

	if(code != "2bmccabe"){

		showToast("Invalid Code. Please try again");
		return false;
	}

	
	return true;
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
	$("#rsvpspinner").show();

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
		  		$("#rsvpspinner").hide();
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
			$(formButton).removeClass('btn-secondary').addClass('btn-primary');
			$(formButton).removeClass('disabled ');
		}

		if(attendingInput === "No"){
			$(hiddenFormItems).hide();
			$(formButton).removeClass('btn-secondary').addClass('btn-primary');
			$(formButton).removeClass('disabled ');
		}

		if(attendingInput === ""){
			$(hiddenFormItems).hide();
			$(formButton).removeClass('btn-primary').addClass('btn-secondary');
			$(formButton).addClass('disabled ');
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
	console.log("group");
	console.log(group);

	if(group != null){
				
		$("#dynamicInput").empty();

		var i = 0;

		for(i;i<group.length; i++){
			var a = group[i];
			console.log("found group member");
			console.log(a);

			if(a['attending'] === "Yes"){
				$("#dynamicInput").append(createAttending(a['forname'], a['surname'], a['starter'], a['main'], a['allergies'], a['_id']));
				console.log("yes");
			}
			if(a['attending'] === "No"){
				$("#dynamicInput").append(createNotAttending(a['forname'], a['surname'], a['_id']));
				console.log("Not");
			}
			if(a['attending'] === ""){
				$("#dynamicInput").append(createForm(a['forname'], a['surname'], a['_id']));
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
		$("#rsvpspinner").show();
	
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

/*function createForm(forename, surname){

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

}*/

function createForm(forename, surname, id){

    var form = $("#ReplyCard").html();

    var replacementDiv = id+"Form";
    var replacementForm = id+"Form";
	var replacementBtn = id+"Submit";
	var replacementItems = id+"Items";


    form = form.replace("$name$", forename + " " + surname);
    form = form.replace("$divName$", replacementDiv);
    form = form.replace("$formName$", replacementForm);
	form = form.replace("$formSubmitBtn$", replacementBtn);
	form = form.replace("$hiddenFormItems$", replacementItems);
	form = form.replace("$id$", id);
	form = form.replace("$id$", id);
	form = form.replace("$id$", id);
	form = form.replace("$id$", id);
	form = form.replace("$id$", id);
	form = form.replace("$id$", id);
	form = form.replace("$id$", id);
	form = form.replace("$id$", id);
	form = form.replace("$id$", id);
	form = form.replace("$id$", id);

	return form;

}

function createAttending(forename, surname, starter, main, allergy, id){
	var attending = $("#AttendingCard").html();


    var replacementDiv = id+"Div";

    attending = attending.replace("$name$", forename + " " + surname);
    attending = attending.replace("$divName$", replacementDiv);
    attending = attending.replace("$divName$", replacementDiv);
    attending = attending.replace("$starterVal$", starter);
	attending = attending.replace("$mainVal$", main);
	attending = attending.replace("$allergyVal$", allergy);
	attending = attending.replace("$id$", id);

	return attending;

}

function createNotAttending(forename, surname, id){
	var notAttending = $("#NotAttendingCard").html();

	var replacementDiv = id+"Div";

	notAttending = notAttending.replace("$name$", forename + " " + surname);
	notAttending = notAttending.replace("$divName$", replacementDiv);
	notAttending = notAttending.replace("$divName$", replacementDiv);
	notAttending = notAttending.replace("$id$", id);


	return notAttending;
}


$(document).on("click", ".clickable", function() {
	var collapsed = $(this).data('target');

	var collapsedDiv = "#"+ collapsed;

	console.log(collapsedDiv);

	$(collapsedDiv).collapse('toggle');
 });

$(document).on("click", ".editBtn", function() {
	

	var data = $(this).data('target');

	var a = attendees.find(x => x['_id'] === data);

	if(a != null){
		resetRsvp(a);
	}
	
 });

$(document).on("click", ".submitBtn", function() {
	
	var form = $(this).closest("form").serializeArray();
	parseForm(form);
	
	
 });

function parseForm(formToProcess){

	var attending = formToProcess[0].value;

	if(attending === 'No'){

		submitNotAttendingResponse();

		$("#modalText").html("<h5>Thank you for the reply</h5><p>Sorry you can't come.</p>");
		$("#modalCenter").modal('show');
	}
	if(attending === 'Yes'){
		if (validateRSVPForm(formToProcess)){
			$("#modalText").html("<h5>Thank you!</h5><p>We look forward to seeing you.</p>");
			$("#modalCenter").modal('show');
			submitAttendingResponse(formToProcess);
		}

	}

}


function validateRSVPForm(form){
	if(form.length != 4){
		return false;
	}
	var attending = form[0].value;
	var starter = form[1].value;
	var main = form[2].value;
	var allergy = form[3].value;

	if(attending != 'Yes'){
		return false;
	}

	if(starter === '' ){

		$("#modalText").html("<p>Please select a Starter</p>");
		$("#modalCenter").modal('show');
		return false;
	}

	if(main === '' ){
		//alert("Please select Main Course");


		$("#modalText").html("<p>Please select Main Course</p>");
		$("#modalCenter").modal('show');

		return false;
	}

	return true;

}

function submitNotAttendingResponse(){

	console.log("submit not attending");
	refreshRSVP();
}

function submitAttendingResponse(form){

	console.log("submit attending");
	refreshRSVP();
}

function resetRsvp(attendee){
	refreshRSVP();
}


function refreshRSVP(){

	getUserGroup();
	generateRSVP();

}












