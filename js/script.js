$( document ).ready(function() {
calculateWeddingCountdown();
  });



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




