
var table0 = [];
var table1 = [];
var table2 = [];
var table3 = [];
var table4 = [];
var table5 = [];
var table6 = [];
var table7 = [];
var table8 = [];
var table9 = [];
var table10 = [];
var table11 = [];
var table12 = [];

var allEntries = [];



$( document ).ready(function() {

	$("#tablesContent").hide();


	$("#tabledetails").hide();

	$("#mealChoiceBtn").click(function(){
		clearArrays();
		getDataTable();
		$("#tabledetails").hide();
		$("#Mealdetails").show();
		$("#mealChoiceBtn").addClass("active");
		$("#peopleBtn").removeClass("active");
	});

	$("#peopleBtn").click(function(){
		getPeopleDataTable();
		$("#tabledetails").show();
		$("#Mealdetails").hide();
		$("#mealChoiceBtn").removeClass("active");
		$("#peopleBtn").addClass("active");
	});

	$("#mealChoiceBtn").click();

	$(document).on("click", "tr", function() {
		findAllergyInfo(this.id);
	});

	$("#tableAdminBtn").click(function(){
		window.location.replace("./admin.html");
	});

	$("#tableHomeBtn").click(function(){
		window.location.replace("./index.html");
	});

	$("#tableStatsBtn").click(function(){
		window.location.replace("./stats.html");
	});


});

function clearArrays(){

	table0 = [];
	table1 = [];
	table2 = [];
	table3 = [];
	table4 = [];
	table5 = [];
	table6 = [];
	table7 = [];
	table8 = [];
	table9 = [];
	table10 =[];
	table11 =[];
	table12 =[];
}

function findAllergyInfo(id){

	var result = allEntries.find(x => x['_id'] === id);

	if(result != null){
		$("#modalTableText").text(result['allergies'])
		$("#modalTable").modal('show');
	}
}


function getPeopleDataTable(){
	populateTable(table0, "ptable0");
	populateTable(table1, "ptable1");
	populateTable(table2, "ptable2");
	populateTable(table3, "ptable3");
	populateTable(table4, "ptable4");
	populateTable(table5, "ptable5");
	populateTable(table6, "ptable6");
	populateTable(table7, "ptable7");
	populateTable(table8, "ptable8");
	populateTable(table9, "ptable9");
	populateTable(table10, "ptable10");
	populateTable(table11, "ptable11");
	populateTable(table12, "ptable12");

}

function populateTable(tableArray, tableName){
	$("#"+tableName).empty();

	for(var i = 0; i< tableArray.length; i++){
		var person = tableArray[i];
		var asterix = "";
		
		if(person['allergies'] != "" && person['allergies'] != "No"){
			asterix = "*";
		}
		$("#"+tableName).append("<tr id="+person['_id']+"><th scope='row'>"+person['forname']+" "+person['surname']+"</th><td>"+person['main']+asterix+"</td></tr>");
	}
}


function getDataTable(){

	var query = {"attending": "Yes"}; // get all records

	var hints = {"$max": 120, "$orderby": {"tableNo": 1}}; // top ten, sort by creation id in descending order
	db = new restdb("60834b7328bf9b609975a5f9", null);
	db.attendee.find(query, hints, function(err, res){
	  if (!err){
	  		clearArrays();
	  		allEntries = res;
	  		populateMyTable(res);
	  		$("#tablespinner").hide();
	  		$("#tablesContent").show();
	  	}
	  });
}

function populateMyTable(){

	var attendees = allEntries;

	for(var i=0;i<attendees.length; i++){
		var attendee = attendees[i];

		if(attendee['tableNo'] == "0"){
			table0.push(attendee);
		}
		if(attendee['tableNo'] == "1"){
			table1.push(attendee);
		}
		if(attendee['tableNo'] == "2"){
			table2.push(attendee);
		}
		if(attendee['tableNo'] == "3"){
			table3.push(attendee);
		}
		if(attendee['tableNo'] == "4"){
			table4.push(attendee);
		}
		if(attendee['tableNo'] == "5"){
			table5.push(attendee);
		}
		if(attendee['tableNo'] == "6"){
			table6.push(attendee);
		}
		if(attendee['tableNo'] == "7"){
			table7.push(attendee);
		}
		if(attendee['tableNo'] == "8"){
			table8.push(attendee);
		}
		if(attendee['tableNo'] == "9"){
			table9.push(attendee);
		}
		if(attendee['tableNo'] == "10"){
			table10.push(attendee);
		}
		if(attendee['tableNo'] == "11"){
			table11.push(attendee);
		}
		if(attendee['tableNo'] == "12"){
			table12.push(attendee);
		}
	}

	populateChart(table0, "table0");
	populateChart(table1, "table1");
	populateChart(table2, "table2");	
	populateChart(table3, "table3");
	populateChart(table4, "table4");
	populateChart(table5, "table5");
	populateChart(table6, "table6");
	populateChart(table7, "table7");
	populateChart(table8, "table8");
	populateChart(table9, "table9");
	populateChart(table10, "table10");
	populateChart(table11, "table11");
	populateChart(table12, "table12");

}



function populateChart(table, tableName){

	var turkeyham = 0;
	var beef = 0;
	var veg = 0;
	var kidsturkeyham = 0;
	var kidsbeef = 0;
	var kidsveg = 0;
	var chickengoujons = 0;
	var beefburger = 0;
	var sausages = 0;
	var notes = "";

	var results = table;

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

			if(a['allergies'] != "" && a['allergies'] != "No"){
				notes = notes + (a['allergies']) + "-" + (a['forname'])+ "-" + (a['main']) + "<br>";
			}
		}
	}

	$("#"+tableName).empty();

	var chartData = [turkeyham, beef, veg, kidsturkeyham, kidsbeef, kidsveg, chickengoujons, beefburger, sausages];

	if(turkeyham != 0){
		$("#"+tableName).append("<tr><th scope='row'>Turkey and Ham</th><td>"+turkeyham+"</td></tr>");
	}
	if(beef != 0){
		$("#"+tableName).append("<tr><th scope='row'>Beef</th><td>"+beef+"</td></tr>");
	}
	if(veg != 0){
		$("#"+tableName).append("<tr><th scope='row'>Vegetarian</th><td>"+veg+"</td></tr>");
	}
	if(kidsturkeyham != 0){
		$("#"+tableName).append("<tr><th scope='row'> Kids Turkey and Ham</th><td>"+kidsturkeyham+"</td></tr>");
	}
	if(kidsbeef != 0){
		$("#"+tableName).append("<tr><th scope='row'>Kids Beef</th><td>"+kidsbeef+"</td></tr>");
	}
	if(kidsveg != 0){
		$("#"+tableName).append("<tr><th scope='row'>Kids Veg</th><td>"+kidsveg+"</td></tr>");
	}
	if(chickengoujons != 0){
		$("#"+tableName).append("<tr><th scope='row'>Kids Goujons</th><td>"+chickengoujons+"</td></tr>");
	}
	if(beefburger != 0){
		$("#"+tableName).append("<tr><th scope='row'>Kids Burger</th><td>"+beefburger+"</td></tr>");
	}
	if(sausages != 0){
		$("#"+tableName).append("<tr><th scope='row'>Kids Sausages</th><td>"+sausages+"</td></tr>");
	}

	$("#"+tableName).append("<tr class='thead-light'><th scope='row'>Total</th><td class='thead-light'>"+table.length+"</td></tr>");

	$("#"+tableName).append("<tr><th scope='row'>Notes</th><td>"+notes+"</td></tr>");


}









