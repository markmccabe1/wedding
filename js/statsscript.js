
var $data = null
var showRSVP = true;
var person = null;

$( document ).ready(function() {
	$("#forbidden").hide();
	checkExistingSession();

	$("#mySearchInput").on("keyup", function() {
		var value = $(this).val().toLowerCase();
		    $("#statsTableBody tr").filter(function() {
		      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		    });
	  	});

	$("#statsAdminBtn").click(function(){
		window.location.replace("./admin.html");
	});

	$("#statsHomeBtn").click(function(){
		window.location.replace("./index.html");
	});
	$("#statsTablesBtn").click(function(){
		window.location.replace("./tabledetail.html");
	});


	$("#replyBtn").click(function(){
		if(showRSVP){
			populateAttendanceTable();
		}
		else{
			populateNonAttendanceTable();
		}

	});


    $(document).on("click", ".tableRow", function() {
		getSinglePersonData(this.id);
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

function populateData(){

	$("#statspinner").hide();
	populateAttendanceStats();
	populateAttendanceTable();
	populateChart();

}

function populateAttendanceStats(){
	var yes = 0;
	var no = 0;
	var maybe = 0;
	var adult = 0;
	var child = 0;
	var results = $data;

	for(var i=0; i< results.length; i++){
		var a = results[i];
		if(a["attending"] == "Yes"){
			yes = yes + 1;
			if(a["type"] == "adult"){
				adult = adult + 1;
			}
			if(a["type"] == "child"){
				child = child + 1;
			}
		}
		if(a["attending"] == "No"){
			no = no + 1;
		}
		if(a["attending"] == "" || a["attending"] == null){
			maybe = maybe + 1;
		}
	}

	$("#yesNum").html(yes);
	$("#noNum").html(no);
	$("#maybeNum").html(maybe);
	$("#adultNum").html(adult);
	$("#childNum").html(child);

}

function populateAttendanceTable(){
	var results = $data;
	resetTable();

	for(var i = 0;i < results.length; i++){
		if(results[i]['attending'] == 'Yes' || results[i]['attending'] == 'No'){
			addRow(results[i]);
		}
	}
	showRSVP = false;

}

function populateNonAttendanceTable(){
	var results = $data;
	resetTable();

	for(var i = 0;i < results.length; i++){
		if(results[i]['attending'] == ''){
			addRow(results[i]);
		}
	}
	showRSVP = true;
}

function resetTable(){
	$("#statsTableBody").html("");
}

function showForbidden(){
	$("#forbidden").show();
	$("#statspinner").hide();
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

	  		populateData();
	  	}
	  });
}

function getSinglePersonData(id){

	var query = {"_id" : id}; // get all records

	var hints = {"$max": 1, "$orderby": {"updateTime": -1}}; // top ten, sort by creation id in descending order
	db = new restdb("60834b7328bf9b609975a5f9", null);
	db.attendee.find(query, hints, function(err, res){
	  if (!err){
	  		showModal(res[0]);
	  	}
	  });
}

function showModal(person){
	$("#modalPersonTitle").html("<h5>"+person['forname']+" "+person['surname']+"</h5>");

	var html = "<p>Type: "+person['type']+"</p><p>Group: "+person['group']+"</p><p>Table No: "+person['tableNo']+"</p><p>Update Time: "+person['updateTime']+"</p><p>Update By: "+person['updatedby']+"</p><p>Username: "+person['username']+"</p>"

	$("#modalPersonText").html(html);
	$("#modalPerson").modal('show');

}

function addRow(attendee){

	var color = "";

	if(attendee['attending'] == "Yes"){
		color = "Green";
	}
	if(attendee['attending'] == "No"){
		color = "Red";
	}

	var row = "<tr class='tableRow' id='"+attendee['_id']+"'style='color:"+color+"'><td>"+attendee['forname']+" "+attendee['surname']+"</td><td>"+attendee['main']+"</td><td>"+attendee['allergies']+"</td></tr>"
	$("#statsTableBody").append(row);
}




function populateChart(){

	var turkeyham = 0;
	var beef = 0;
	var veg = 0;
	var kidsturkeyham = 0;
	var kidsbeef = 0;
	var kidsveg = 0;
	var chickengoujons = 0;
	var beefburger = 0;
	var sausages = 0;

	var results = $data;

	for (var i = 0; i < results.length; i++){
		var a = results[i];

		if(a['attending']== "Yes"){
			
			if(a['main'] == "Beef"){
				if(a['type'] == 'adult'){
					beef = beef + 1
				}
				if(a['type'] == 'child'){
					kidsbeef = kidsbeef + 1
				}
			}
			if(a['main'] == "Turkey & Ham"){
				if(a['type'] == 'adult'){
					turkeyham = turkeyham + 1
				}
				if(a['type'] == 'child'){
					kidsturkeyham = kidsturkeyham + 1
				}
			}
			if(a['main'] == "Vegetarian"){
				if(a['type'] == 'adult'){
					veg = veg + 1				
				}
				if(a['type'] == 'child'){
					kidsveg = kidsveg + 1				
				}
				
			}
			if(a['main'] == "Chicken Goujons"){
				chickengoujons = chickengoujons + 1
			}
			if(a['main'] == "Mini Beef Burger"){
				beefburger = beefburger + 1
			}
			if(a['main'] == "Sausages"){
				sausages = sausages + 1
			}
		}
	}

	var chartData = [turkeyham, beef, veg, kidsturkeyham, kidsbeef, kidsveg, chickengoujons, beefburger, sausages];





	const ctx = document.getElementById('myChart').getContext('2d');
	const chart = new Chart(ctx, {
	  type: 'doughnut',
	  data: {
	    labels: ['Turkey & Ham', 'Beef', 'Vegetarian', 'Kids Turkey & Ham', 'Kids Beef', 'Kids Vegetarian', 'Chicken Goujons', 'Beef Burger', 'Sausages'],
	    datasets: [{
	      label: '# of meals',
	      data: chartData,
	      backgroundColor: [
	        
	        'blue',
	        'red',
	        'green',
	        'lightblue',
	        'pink',
	        'lightgreen', 
	        'orange', 
	        'yellow',
	        'brown'
	        
	      ],
	      borderColor: [
	        'blue',
	        'red',
	        'green',
	        'lightblue',
	        'pink',
	        'lightgreen', 
	        'orange', 
	        'yellow',
	        'brown'
	      ],
	      borderWidth: 1
	    }]
	  },
	  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      }
    }
  },
	});
}
















