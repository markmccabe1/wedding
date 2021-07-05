
var $data = null

$( document ).ready(function() {
	$("#adminforbidden").hide();
	checkExistingSession();

	$("#myAdminSearchInput").on("keyup", function() {
		var value = $(this).val().toLowerCase();
		    $("#myTable tr").filter(function() {
		      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		    });
	  	});

	$("#statsBtn").click(function(){
		window.location.replace("./stats.html");
	});

	$("#homeBtn").click(function(){
		window.location.replace("./index.html");
	});

	$("#tablesBtn").click(function(){
		window.location.replace("./tabledetail.html");
	});

	
});


function checkExistingSession(){

	var forename = localStorage.getItem('forename');
	var surname = localStorage.getItem('surname');
	var tempAttendee = localStorage.getItem('attendee');

	if(forename != null && surname != null){
		$user = forename+" " + surname;
		$username = $user.replace(/\W/g, '').toLowerCase();
		attendee = JSON.parse(tempAttendee);
		if(forename == "Admin" && surname == "User"){
			getData();
		}
		else{
			showForbidden();
		}

	}
	else{

		showForbidden();
	}
}


function showForbidden(){
	$("#adminforbidden").show();
	$("#adminspinner").hide();
}


function getData(){
	var query = {}; // get all records

	var hints = {"$max": 150, "$orderby": {"updateTime": -1}}; // top ten, sort by creation id in descending order
	db = new restdb("60834b7328bf9b609975a5f9", null);
	db.attendee.find(query, hints, function(err, res){
	  if (!err){
	  		$data = [];

	  		for(var i=0;i<res.length;i++){
	  			var a = res[i];

	  			if(a['username'] != "adminuser"){
	  				$data.push(a);
	  			}
	  		}

	  		populateTable();
	  	}
	  });
}


function populateTable(){
	$("#adminspinner").hide();
	var attendees = $data;

	for(var i=0;i<attendees.length; i++){
		addRow(attendees[i]);
	}

	$('#myTable').DataTable({
    ordering: true,
    searching:false,
    paging: false,
    rowReorder: {
            selector: 'td'
        },
    responsive: true
	});


	$("#tableOfUsers").show();
}

function addRow(attendee){

	var updateBy = "";
	var updateTime = "";

	if(attendee['updatedby'] != null){
		updateBy = attendee['updatedby']
	}

	if(attendee['updateTime'] != null){
		updateTime = attendee['updateTime']
	}



	var row = "<tr><td>"+attendee['forname']+"</td><td>"+attendee['surname']+"</td><td>"+attendee['attending']+"</td><td>"+attendee['starter']+"</td><td>"+attendee['main']+"</td><td>"+attendee['allergies']+"</td><td>"+attendee['username']+"</td><td>"+updateBy+"</td><td>"+updateTime+"</td></tr>";
	console.log(row);
	$("#tableBody").append(row);
}




















