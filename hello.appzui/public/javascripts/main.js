$(document).ready(function() {
		var iosocket = io.connect();
	
	    var redswitch = document.getElementById('redonoffswitch');
	    var redlight = document.querySelector('.red');
	    
	    var yellowswitch = document.getElementById('yellowonoffswitch');
	    var yellowlight = document.querySelector('.yellow');
	    
	    var greenswitch = document.getElementById('greenonoffswitch');
	    var greenlight = document.querySelector('.green');
	    
	    function updateLight(evt) {
	        if(this.checked) {
	        	evt.target.lightobj.classList.add(evt.target.newclass);
	        } else {
	        	evt.target.lightobj.classList.remove(evt.target.newclass);
	        }
	    	var statusobj = {
	    		    light: event.target.name,
	    		    lightclass: evt.target.newclass,
	    		    newstatus: this.checked,
	    		}
    		iosocket.emit("setstatus",statusobj);
    		console.log("emitted");
	    }

	    function syncLight(statusarr) {
	    	var status  = Boolean(statusarr["newstatus"]);
	    	var objname = statusarr["light"];
	    	var classname = statusarr["lightclass"];
	    	var switchobj = document.getElementById(objname);
	    	switchobj.classList.remove(classname);
	    	if(status){
	    		switchobj.classList.add(classname);
	    	} 
	    	switchobj.checked = status;
	    }
	    
	    iosocket.on('connect', function () {
            iosocket.on('setstatus', function(message) {
            	 var servermsg = JSON.parse(JSON.stringify(message));
            	 syncLight(servermsg);
            	 populatestatusTable();
            	 console.log("servermsg : " + servermsg["light"]);
             });
        });
	    
	    redswitch.addEventListener('change', updateLight, false);
	    redswitch.lightobj = redlight;
	    redswitch.newclass = "redon";
	    
	    yellowswitch.addEventListener('change', updateLight, false);
	    yellowswitch.lightobj = yellowlight;
	    yellowswitch.newclass = "yellowon";
	    
	    greenswitch.addEventListener('change', updateLight, false);
	    greenswitch.lightobj = greenlight;
	    greenswitch.newclass = "greenon";
	    
	    
	    $("#ajaxbutton").click(function(){
	    	var urlext = $("#lightsid option:selected").text();
	    	var tableContent = '';
	    	$.getJSON( '/states/'+ $.trim(urlext), function( data ) {
	    		console.log("Inside" + JSON.stringify(data));
	    		$.each(data, function(){
	    			 console.log(this.lightclass);
	                 tableContent += '<tr>';
	                 tableContent += '<td>' + this.lightclass + '</td>';
	                 tableContent += '<td>' + (this.newstatus ? "On" : "Off") + '</td>';         
	                 tableContent += '</tr>';
	             });
	             $('#ajaxstate table tbody').html(tableContent);
	        });
	    });
	    
});

function populatestatusTable() {
    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/history', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.light + '</td>';
            tableContent += '<td>' + (this.state ? "On" : "Off") + '</td>';
            tableContent += '<td>' + this.timestp + '</td>';            
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#history table tbody').html(tableContent);
    });
};

function populatestatusTable() {
    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/history', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.light + '</td>';
            tableContent += '<td>' + (this.state ? "On" : "Off") + '</td>';
            tableContent += '<td>' + this.timestp + '</td>';            
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#history table tbody').html(tableContent);
    });
};



populatestatusTable();