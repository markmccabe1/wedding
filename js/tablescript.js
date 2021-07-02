
$( document ).ready(function() {
	$( "#tableDiv" ).hide();
	var urlParams = new URLSearchParams(window.location.search);
	var myParam = urlParams.get('table');
	getTable(myParam);


	$( "#tableForm" ).submit(function( event ) {
	 	event.preventDefault();
	  	$("#tablespinner").show();
	  	var tN = $("#inputTableNo").val();
	  	getTable(tN);
	});

});

$(".tableh1").click(function(){
		location.reload();
	});



function getTable(tableNumberString){
	console.log("getting table "+tableNumberString);

	if(tableNumberString == null || tableNumberString == ""){
		$("#tablespinner").hide();
		$( "#tableDiv" ).show();
		return;
	}
	$( "#tableDiv" ).hide();

	var tableNumber = parseInt(tableNumberString, 10);

	var query = {"tableNo" : tableNumber, "attending": "Yes"}; // get all records

	var hints = {"$max": 20, "$orderby": {"group": 1}}; // top ten, sort by creation id in descending order
	db = new restdb("60834b7328bf9b609975a5f9", null);
	db.attendee.find(query, hints, function(err, res){
	  if (!err){
	  		
	  		populateMyTable(res, tableNumber);
	  	}
	  });
}

function populateMyTable(attendees, tableNumber){
	console.log(attendees)
	$("#tablespinner").hide();
	if(attendees.length === 0){
		$("#tableRefLabel").text("Not Found : Table #:"+tableNumber);
		$( "#tableDiv" ).show();
		return
	}

	if(tableNumber == 0){
		
		$("#tableRefLabel").text("Top Table");

	}
	else{

		$("#tableRefLabel").text("Table #"+tableNumber);

	}

	for(var i=0;i<attendees.length; i++){
		addRow(attendees[i]);
	}
	$("#myTable").show();

}

function addRow(attendee){

	var chair = "<div class='myChair'> <h3>"+attendee['forname']+" "+attendee['surname']+"</h3> <p>Starter: "+attendee['starter']+"</p><p>Main: "+attendee['main']+"</p><p>Notes: "+attendee['allergies']+"</p></div>";
	$("#myTable").append(chair);
}









