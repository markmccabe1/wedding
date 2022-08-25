
var $user = "";
var $username = "";
var loadCounter = 0;
var db = null;
var attendee = null;
var userGroup = [];
var offsetDiv;
var windowOffset;


$( document ).ready(function() {
	$("#content").show();
	attendee = null;
	$("#tableOfUsers").hide();
	//checkExistingSession()
	calculateWeddingCountdown();


	$( "#loginForm" ).submit(function( event ) {
	 	event.preventDefault();
	  	$("#spinner").show();
		$("#loginForm").hide();
		onFormSubmit();

	});
	
	$("#signOutButton").click(function(){
		removeAttendee();
		$("#tableOfUsers").hide();
		$("#myTable").DataTable().destroy();
		blankFields();
		showLogin();
		showToast("Logged Out");
	});

	$("#myInput").on("keyup", function() {
		var value = $(this).val().toLowerCase();
		    $("#tableBody tr").filter(function() {
		      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		    });
	  	});

	$(document).on("click", "#statsBtn", function() {
		window.location.replace("./stats.html");
	});

	$(document).on("click", "#adminBtn", function() {
		window.location.replace("./admin.html");
	});

});

Element.prototype.documentOffsetTop = function () {
			    return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );
};


function isInvalidString(str){
	  var letters = /^[a-zA-Z].*[\s\.]*$/g;
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
		$("#loginForm").show();

	}
}



function validateForm(){

	var forename = $("#forenameInput").val();
	var surname = $("#surnameInput").val();

	$user = forename + " " + surname;
	var code = $("#codeInput").val().toLowerCase();
	
	if(isInvalidString(forename)){
		showModal("Invalid Forename. Please try again");
		return false;
	}

	if(isInvalidString(surname)){
		showModal("Invalid Surname. Please try again");
		return false;
	}
	
	if($user == null || $user === ""){
		showModal("Invalid Name. Please try again");
		return false;
	}

	if(code != "baby"){

		showModal("Invalid Code. Please try again");
		return false;
	}

	$username = $user.replace(/\W/g, '').toLowerCase();

	
	return true;
}

function findUser(){
	
	if($username == null){
		console.log("invalid username");
		return;
	}

	var query = {"username" : $username}; // get all records
	var hints = {"$max": 10, "$orderby": {"_id": -1}}; // top ten, sort by creation id in descending order
	db = new restdb("60834b7328bf9b609975a5f9", null);
	db.attendee.find(query, hints, function(err, res){
	  if (!err){
	  	attendee = res[0];

	  	if(attendee != null){
	  		setAttendee();
			showContentImmediately();
			getUserGroup();

			if(attendee['forname'] == "Admin" && attendee['surname'] == "User"){
				showAdminTable();
			}
			

	  		if(attendee['attending'] == ""){
	  			showBodyToast("You're Invited. Please RSVP below");
		  	}
		  	if (attendee['attending'] == "Yes"){
		  		showBodyToast("Thanks for RSVP'ing.");
		  	}
	  	}
	  	else{
	  		showModal("Can't find "+ $user +".");
	  		$("#loginForm").show();

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
		return;
	}
	var group = attendee['group'];
	if(group == ""){
		userGroup = [attendee];
		generateRSVP();
	}
	else{
		var query = {"group" : group}; // get all records

		var hints = {"$max": 10, "$orderby": {"forname": 1}}; // top ten, sort by creation id in descending order
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
	$username = "";
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
		$username = $user.replace(/\W/g, '').toLowerCase();
		attendee = JSON.parse(tempAttendee);
		showContentImmediately();
		getUserGroup();

		if(forename == "Admin" && surname == "User"){
			showAdminTable();
		}
	}
	else{
			
			//showLogin();
	}
}

function generateRSVP(){
	
	var group = userGroup;

	if(group != null){
				
		$("#dynamicInput").empty();

		var i = 0;

		for(i;i<group.length; i++){
			var a = group[i];

			if(a['attending'] === "Yes"){
				$("#dynamicInput").append(createAttending(a['forname'], a['surname'], a['starter'], a['main'], a['allergies'], a['type'], a['_id']));
				if(a['type'] == 'child'){
					updateChildAttending(a['_id']);
				}
			}
			if(a['attending'] === "No"){
				$("#dynamicInput").append(createNotAttending(a['forname'], a['surname'], a['_id']));
			}
			if(a['attending'] === ""){
				$("#dynamicInput").append(createForm(a['forname'], a['surname'], a['_id'], a['type']));
				if(a['type'] == 'child'){
					updateChildSelect(a['_id']);
				}
			}
		}
	}
}


function updateChildSelect(id){

	var select = $("#"+id+"mainSelect");

	var o = new Option("Chicken Goujons", "Chicken Goujons");
	$(o).html("Chicken Goujons");

	var o1 = new Option("Mini Beef Burger", "Mini Beef Burger");
	$(o1).html("Mini Beef Burger");

	var o2 = new Option("Sausages", "Sausages");
	$(o2).html("Sausages");

	$(select).append(o);
	$(select).append(o1);
	$(select).append(o2);
}

function updateChildAttending(id){


	$("#"+id+"DessertValue").html("Ice Cream");

}



function calculateWeddingCountdown(){
    
    //Get today's date.
    var now = new Date();
 
 
    var dueDate =  new Date("2022-11-03T00:00:00");

 
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
		$("html, body").animate({scrollTop: $("#content").offset().top});
}

function showLogin(){
		
		$("#spinner").hide();
		$("#access").show();
		$("#content").hide();
		$("#loginForm").show();
		$("#loginForm").trigger("reset");
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

function createForm(forename, surname, id, type){

    var form = $("#ReplyCard").html();

    var borderSpecial = id+"borderSpecial";
    var replacementDiv = id+"Form";
    var replacementForm = id+"Form";
	var replacementBtn = id+"Submit";
	var replacementItems = id+"Items";


    form = form.replace("$name$", forename + " " + surname);
    form = form.replace("$divName$", replacementDiv);
    form = form.replace("$formName$", replacementForm);
	form = form.replace("$formSubmitBtn$", replacementBtn);
	form = form.replace("$hiddenFormItems$", replacementItems);
	form = form.replace("$specialBorder$", borderSpecial);
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
	form = form.replace("$id$", id);
	form = form.replace("$id$", id);
	form = form.replace("$id$", id);

	return form;

}

function createAttending(forename, surname, starter, main, allergy, type, id){
	var attending = $("#AttendingCard").html();
	var borderSpecial = id+"borderSpecial";

	if(allergy == ""){
		allergy = "None";
	}
    var replacementDiv = id+"Div";
    var replacementStarterHeader = id+"StarterHeader";
    var replacementStarterValue = id+"StarterValue";
    var replacementDessertValue = id+"DessertValue";

    attending = attending.replace("$name$", forename + " " + surname);
    attending = attending.replace("$divName$", replacementDiv);
    attending = attending.replace("$divName$", replacementDiv);
    attending = attending.replace("$starterVal$", starter);
	attending = attending.replace("$mainVal$", main);
	attending = attending.replace("$allergyVal$", allergy);
	attending = attending.replace("$id$", id);
	attending = attending.replace("$specialBorder$", borderSpecial);
	attending = attending.replace("$starterHeader", replacementStarterHeader);
	attending = attending.replace("$starterValue", replacementStarterValue);
	attending = attending.replace("$dessertValue", replacementDessertValue);

	return attending;

}

function createNotAttending(forename, surname, id){
	var notAttending = $("#NotAttendingCard").html();
	var borderSpecial = id+"borderSpecial";

	var replacementDiv = id+"Div";

	notAttending = notAttending.replace("$name$", forename + " " + surname);
	notAttending = notAttending.replace("$divName$", replacementDiv);
	notAttending = notAttending.replace("$divName$", replacementDiv);
	notAttending = notAttending.replace("$id$", id);
	notAttending = notAttending.replace("$id$", id);
	notAttending = notAttending.replace("$specialBorder$", borderSpecial);


	return notAttending;
}


$(document).on("click", ".clickable", function() {
	var collapsed = $(this).data('target');

	var collapsedDiv = "#"+ collapsed;

	$(collapsedDiv).collapse('toggle');

	offsetDiv = $(collapsedDiv).offset();
	windowOffset = $(window).scrollTop();

 });

$(document).on("click", ".editBtn", function() {

	//var nav = $('html, body').animate({scrollTop:$('#rsvp').position().top}, 'slow');

	$(this).closest('.card-body').collapse('toggle');

	var div = $(this).closest('.borderSpecial').find('.spinnerUpdate');

	div.html('<div class="spinner-border float-right"></div>');

	$("body, html").animate({
	    scrollTop: windowOffset
	});

	var id = $(this).attr('data-target');

	var a = userGroup.find(x => x['_id'] === id);

	var data = $(this).data('target');

	var a = userGroup.find(x => x['_id'] === data);

	if(a != null){
		resetRsvp(a);
	}
	
 });


$(document).on("click", "#helpBtn", function() {

	$("#modalBig").modal('show');

});



$(document).on("click", ".submitBtn", function() {
	
	//$(this).closest('.card-body').collapse('toggle');
	//$(this).closest('.borderSpecial').find('.spinnerUpdate').html('<div class="spinner-border float-right"></div>');

	var form = $(this).closest("form");
	var div = $(this).closest('div');

	if(parseForm(form, div)){

		$(this).closest('.card-body').collapse('toggle');
		$(this).closest('.borderSpecial').find('.spinnerUpdate').html('<div class="spinner-border float-right"></div>');
		$("body, html").animate({
		    scrollTop: windowOffset
		});
	};

	
	
 });

function parseForm(form, div){

	var id = form.attr('data-target');

	var a = userGroup.find(x => x['_id'] === id);

	var formToProcess = form.serializeArray()

	var attending = formToProcess[0].value;    

	if(attending === 'No'){

		submitNotAttendingResponse(a);
		return true;

	}
	if(attending === 'Yes'){
		if (validateRSVPForm(formToProcess, a)){

			submitAttendingResponse(formToProcess, a);
			return true;
		}

	}

}


function validateRSVPForm(formToProcess){

	if(formToProcess.length != 3){
		return false;
	}
	var attending = formToProcess[0].value;
	var main = formToProcess[1].value;
	var allergy = formToProcess[2].value;

	if(attending != 'Yes'){
		return false;
	}

	if(main === '' ){

		showModal("Please select a Main Course");

		return false;
	}

	return true;

}

function showModal(text){
	$("#modalTitle").html("<h5>Whoops...</h5>");
	$("#modalText").html("<p>"+text+"</p>");
	$("#modalCenter").modal('show');
}

function showAttendingModal(text){
	$("#modalTitle").html("<h5>Response Submitted</h5>");
	$("#modalText").html(text);
	$("#modalCenter").modal('show');
}

function submitNotAttendingResponse(attendeeFromForm){

	var jsondata = {"forname": attendeeFromForm['forname'],"surname": attendeeFromForm['surname'],"type":attendeeFromForm['type'],"attending":"No","starter":"","main":"","allergies":"","group":attendeeFromForm['group'], "username": attendeeFromForm['username'], "updatedby": $username, "updateTime" : new Date().toISOString()};
	updateRecord(jsondata, attendeeFromForm['_id']);
	showAttendingModal("<p>Response submitted for </p><h5>"+attendeeFromForm['forname']+" "+attendeeFromForm['surname']+"</h5><p>Sorry you can't make it.</p>");

}

function submitAttendingResponse(form, attendeeFromForm){

	var attending = form[0].value;
	var starter = "Potato & Leek Soup";
	var main = form[1].value;
	var allergy = form[2].value;	

	var jsondata = {"forname": attendeeFromForm['forname'],"surname": attendeeFromForm['surname'],"type":attendeeFromForm['type'],"attending":"Yes","starter":starter,"main":main,"allergies":allergy,"group":attendeeFromForm['group'], "username": attendeeFromForm['username'], "updatedby": $username, "updateTime" : new Date().toISOString()};
	updateRecord(jsondata, attendeeFromForm['_id']);
	showAttendingModal("<p>Response submitted for </p><h5>"+attendeeFromForm['forname']+" "+attendeeFromForm['surname']+"</h5><p>See you there.</p>");
}

function resetRsvp(attendeeFromForm){
	var jsondata = {"forname": attendeeFromForm['forname'],"surname": attendeeFromForm['surname'],"type":attendeeFromForm['type'],"attending":"","starter":"","main":"","allergies":"","group":attendeeFromForm['group'], "username": attendeeFromForm['username'], "updatedby": $username, "updateTime" : new Date().toISOString()};
	updateRecord(jsondata, attendeeFromForm['_id']);
	showAttendingModal("<p>Response reset for </p><h5>"+attendeeFromForm['forname']+" "+attendeeFromForm['surname']+"</h5>");


}


function refreshRSVP(){
	getUserGroup();

}

function updateRecord(jsondata, id){

	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "https://wedding-9b40.restdb.io/rest/attendee/"+id,
	  "method": "PUT",
	  "headers": {
	    "content-type": "application/json",
	    "x-apikey": "60834b7328bf9b609975a5f9",
	    "cache-control": "no-cache"
	  },
	  "processData": false,
	  "data": JSON.stringify(jsondata)
	}

	$.ajax(settings).done(function (response) {
	  	refreshRSVP();
	});


}

function showAdminTable(){

	$("#myNavBar").append("<li class='nav-item js-scroll-trigger'> <a class='nav-link js-scroll-trigger' id='adminBtn'>Admin</a></li>"+
		"<li class='nav-item'> <a class='nav-link js-scroll-trigger' id='statsBtn'>Stats</a></li>");

}








