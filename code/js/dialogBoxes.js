

/*@author Kade Nethercott*/

 $(document).ready(function() {
var btn = $.fn.button.noConflict(); // reverts $.fn.button to jqueryui btn
$.fn.btn = btn; // assigns bootstrap button functionality to $.fn.btn

 $( ".dialog-newMap" ).dialog({
      autoOpen: false,
      height: 400,
      width: 450,
      modal: true,      
      show: "drop",
      hide: "drop",
      buttons: {
        "Create": function() {
					var mapName = String($("#newMapName").val());
						var errors = false;

          if(mapName==""){
          	errors=true;
          	$(".errors").text("Please enter a valid name");
	      		$('.errors').css("display", "block");
	      		$('.errors').fadeOut(4000);
      	  }
	        for(var m in ownedMaps){
      	 		if(ownedMaps[m].name==mapName){
      	 			errors=true;
      	 			$(".errors").text("Map Name already exists");
	      			$('.errors').css("display", "block");
	      			$('.errors').fadeOut(4000);
      	 		}
      	 	}
      	  if (!errors){
				    $("#canvasName").text(mapName);
					  map.title= mapName;
					  create2DArray(map.data.bottom);
					  create2DArray(map.data.middle);
					  create2DArray(map.data.top);
						map.events.length = 0;	
						$.post("database.php",{
		  	  			action: "getusercredentials",
		  	  			
		  	  		},
		  	  		function(data){
		  	  			console.log(data.message);
		  	  			console.log(data.data.username);
		  	  			map.author= data.data.username;
		  	  			console.log(map.author);
		  	  			$.post("database.php",{
		  	  				action: "savemap",
		  	  				height: map.height,
		  	  				width: map.width,
		  	  				title: map.title,
		  	  				data: JSON.stringify(map)
		  	  			},
		  	  			function(data){
		  	  				console.log(data.message);
		  	  				//delete the undoRedoArray 
		   	    			undoRedoArray.length = 0;
					  			undoRedoPos = 0;
					  			undoRedoArray[undoRedoPos] = new Object();
					  			copyObjects(undoRedoArray[0], map);
					  			paintMap();
					        	   
				    			$(".dialog-newMap").dialog( "close" );
				    			$(".mC").hide();	
									$(".mC").slideDown(1200);
		  	  			}, 
		  	  			"json");
		  	  		}, 
		  	  		"json");		
				  	}        	
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
      	$(".errors").val("");
      	$('.errors').css("display", "none");
      	dialogOpen=false;
      }
    });

      $( ".dialog-openMap" ).dialog({
      autoOpen: false,
      height: 400,
      width: 450,
      modal: true,      
      show: "fold",
      hide: "fold",

      buttons: {
        "Open": function() {
		 			var mapName = String($("#openMapName").val());
		 			var mapJson={};
		 			var result;
		 			var dialogBox = this;
					var errors = true;
       
          if(mapName!=""){
          	errors = false;
          	$.post("database.php", {
		 					action: "loadmap",
		 					title: mapName
		 				}, 
		 				function(data){
		 					data = JSON.parse(data);
		 					console.log(data.message);
		 					if(data.data instanceof Object){
		 						map=data.data;
           			$("#canvasName").text(mapName);
	
								currentMapName = mapName;
								undoRedoArray.length = 0;
				    	  undoRedoPos = 0;
				    	  undoRedoArray[undoRedoPos] = new Object();
					    	copyObjects(undoRedoArray[0], map);
				       
				       	paintMap();
							
			        	    $(".dialog-openMap").dialog("close");
			        	    $(".mC").hide();	
							$(".mC").slideDown(1200);
			        	}
			      	else{
			       		errors=true;
			       		$(".errors").text(JSON.stringify(data.message));
	      				$('.errors').css("display", "block");
	      				$('.errors').fadeOut(4000);
			      	}
						}, "text");
          	}
          	else{
          		errors=true;
          		$(".errors").text("Please enter a valid name");
	      		$('.errors').css("display", "block");
	      		$('.errors').fadeOut(4000);
	      	}
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
		$(".errors").val("");
      	$('.errors').css("display", "none");
      	dialogOpen=false;
      }
    });

     $( ".dialog-saveAsMap" ).dialog({
      autoOpen: false,
      height: 400,
      width: 450,
      modal: true,      
      show: "clip",
      hide: "clip",
      buttons: {
        "Save As": function() 
     	{  //allFields.removeClass( "ui-state-error" );
		 	var mapName = String($("#saveAsMapName").val()); 
	        if(mapName!=""){
	       	    map.title= mapName;
	       	  	$.post("database.php",{
       	  			action: "savemap",
       	  			height: map.height,
       	  			width: map.width,
       	  			title: map.title,
       	  			overwrite: false,
       	  			data: JSON.stringify(map)
       	  		},
       	  		function(data){
       	  			console.log(data.message);
       	  			if(data.return==0){
       	  				$("#canvasName").text(mapName);
	            		$(".dialog-saveAsMap").dialog( "close" );
	            	}
	            	else{
	            		$(".errors").text(data.message);
	    	 					$('.errors').css("display", "block");
	    	 					$('.errors').fadeOut(4000);
	            	}
       	  		}, 
       	  		"json");
      		 }
      		else{
        	 	$(".errors").text("Please enter a valid name");
	    	 		$('.errors').css("display", "block");
	    	 		$('.errors').fadeOut(4000);
      		}
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
		$(".errors").val("");
      	$('.errors').css("display", "none");
      	dialogOpen=false;
      }
    });

 $( ".dialog-randomMap" ).dialog({
      autoOpen: false,
      height: 400,
      width: 450,
      modal: true,      
      show: "drop",
      hide: "drop",
      buttons: {
        "Create": function() {
        	//console.log("starting new map");
					var mapName = String($("#randomMapName").val());
					var errors = false;
				
	        if(mapName==""){
	         	errors=true;
	         	$(".errors").text("Please enter a valid name");
		     		$('.errors').css("display", "block");
		     		$('.errors').fadeOut(4000);
	        }
		      for(var m in ownedMaps){
	      		//console.log(ownedMaps[m].name);
	      		if(ownedMaps[m].name==mapName){
	      			errors=true;
	      			$(".errors").text("Map Name already exists");
		    		$('.errors').css("display", "block");
		    		$('.errors').fadeOut(4000);
	      		}
	    		}
	    		if (!errors){
		  	    $("#canvasName").text(mapName);

	    	    map.title= mapName;
	    	  	genRandom(map.data.bottom, map.data.middle, map.data.top);
						map.events.length = 0;			
						        	  	
					   $.post("database.php",{
					   		action: "savemap",
					   		height: map.height,
					   		width: map.width,
					   		title: map.title,
					   		data: JSON.stringify(map)
					   	},
					   	function(data){
					   		console.log(data.message);
					   	}, 
					   	"json");
				 	    //delete the undoRedoArray 
					    undoRedoArray.length = 0;
					    undoRedoPos = 0;
					    undoRedoArray[undoRedoPos] = new Object();
					    copyObjects(undoRedoArray[0], map);
					    paintMap();
					    $(".dialog-randomMap").dialog( "close" );
					    $(".mC").hide();	
							$(".mC").slideDown(1200);
					}
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
      	$(".errors").val("");
      	$('.errors').css("display", "none");
      	dialogOpen=false;
      }
    });

  $( ".dialog-treasure" ).dialog({
      autoOpen: false,
      height: 350,
      width: 400,
      modal: true,      
      show: "clip",
      hide: "clip",
      buttons: {
        "Submit": function() { 
     		
	       	var tBox = new Object();
	       	tBox.id = "treasure";
	       	tBox.x = newEvent.x;
	       	tBox.y = newEvent.y
	       	tBox.item = $("#tBoxItem").val();
	       	if(tBox.item.toLowerCase()=="shotgun"){
	       		tBox.item=1;
	       		searchEvents(tBox);
	       		undoRedoPos++;
						undoRedoArray[undoRedoPos]= new Object();
						copyObjects(undoRedoArray[undoRedoPos], map);
	       		$('.dialog-treasure').dialog("close");
	       	}
	       	else if(tBox.item.toLowerCase()=="knife"){
	       		tBox.item=2;
	       		searchEvents(tBox);
	       		undoRedoPos++;
						undoRedoArray[undoRedoPos]= new Object();
						copyObjects(undoRedoArray[undoRedoPos], map);
	       		$('.dialog-treasure').dialog("close");
	       	}
	       	else if(tBox.item.toLowerCase()=="machine gun"){
	       		tBox.item=3;
	       		searchEvents(tBox);
	       		undoRedoPos++;
						undoRedoArray[undoRedoPos]= new Object();
						copyObjects(undoRedoArray[undoRedoPos], map);
	       		$('.dialog-treasure').dialog("close");
	       	}
      		else{
        	 	$(".errors").text("Options: Shotgun, Knife, Machine Gun");
	    	 		$('.errors').css("display", "block");
	    	 		$('.errors').fadeOut(4000);
      		}
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
		$(".errors").val("");
      	$('.errors').css("display", "none");
      	dialogOpen=false;
      }
    });
  $( ".dialog-hole" ).dialog({
      autoOpen: false,
      height: 450,
      width: 500,
      modal: true,      
      show: "clip",
      hide: "clip",
      buttons: {
        "Submit": function() { 
	       	var errorM = "";
	       	var isError = false;
	       	var found = false;
	       	var fieldsEntered = false;
	       	
	       	var hole = new Object();
	       	hole.id = "hole";
	       	hole.x = newEvent.x;
	       	hole.y = newEvent.y;
	       	hole.d_id = $("#hDid").val();
	       	hole.d_x = $("#hDxLoc").val();
	       	hole.d_y = $("#hDyLoc").val();

	       	  	//console.log(ownedMaps[0].name);
	       	for(var m in ownedMaps){
      	 	//console.log(ownedMaps[m].name);
      	 		if(ownedMaps[m].name==hole.d_id){
      	 			found=true;
      	 		}
      	 	        	//console.log("ending getownedmaps");
      	 	}
      	 	if(!found){
      	 		isError=true;
      	 		errorM = "Map "+ hole.d_id + " doesn't exist ...";
      	 	}	
	       	if(!isNaN(hole.d_x) && !isNaN(hole.d_y ) && hole.d_id != "" ){
	       		fieldsEntered = true;
	       	}
	       	else{
	       		fieldsEntered=false;
	       		isError=true;
	       		errorM = errorM + "Please enter all fields ...";
	       	}
	       	if(found && fieldsEntered){
	       		if(hole.d_x != ""){
	       			hole.d_x = parseInt($("#dDxLoc").val());
	       		}
	       		if(hole.d_y != ""){
	       			hole.d_y = parseInt($("#dDyLoc").val());
	       		}		
	       		searchEvents(hole);
	       		undoRedoPos++;
						undoRedoArray[undoRedoPos]= new Object();
						copyObjects(undoRedoArray[undoRedoPos], map);
						isError = false;	
	       		$('.dialog-hole').dialog("close");
	       	}
      		if(isError){	
      			$(".errors").text(errorM);
	    			$('.errors').css("display", "block");
	    			$('.errors').fadeOut(4000);
	    		}
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
		$(".errors").val("");
      	$('.errors').css("display", "none");
      	dialogOpen=false;
      }
    });

$( ".dialog-door" ).dialog({
      autoOpen: false,
      height: 450,
      width: 500,
      modal: true,      
      show: "clip",
      hide: "clip",
      buttons: {
        "Submit": function() { 
     		
	       	var door = new Object();
	       	var errorM = "";
	       	var isError = false;
	       	var found = false;
	       	var fieldsEntered = false;
	       	door.id = "door";
	       	door.x = newEvent.x;
	       	door.y = newEvent.y;
	       	door.d_id = $("#dDid").val();
	       	door.d_x = $("#dDxLoc").val();
	       	door.d_y = $("#dDyLoc").val();

	       	  	//console.log(ownedMaps[0].name);
	       	for(var m in ownedMaps){
      	 		if(ownedMaps[m].name==door.d_id){
      	 			found=true;
      	 		}
      	 	}
      	 	if(!found){
      	 		isError=true;
      	 		errorM = "Map "+ door.d_id + " doesn't exist ...";
      	 	}	
	       	if(!isNaN(door.d_x) && !isNaN(door.d_y ) && door.d_id != ""){
	       		fieldsEntered = true;
	       	}
	       	else{
	       		fieldsEntered=false;
	       		isError=true;
	       		errorM = errorM + "Please enter all fields ...";
	       	}
	       	if(found && fieldsEntered){
	       		if(door.d_x != ""){
	       			door.d_x = parseInt($("#dDxLoc").val());
	       		}
	       		if(door.d_y != ""){
	       			door.d_y = parseInt($("#dDyLoc").val());
	       		}
	       		searchEvents(door);
	       		undoRedoPos++;
						undoRedoArray[undoRedoPos]= new Object();
						copyObjects(undoRedoArray[undoRedoPos], map);
						isError = false;	
	       		$('.dialog-door').dialog("close");
	       	}
      		if(isError){	
      			$(".errors").text(errorM);
	    			$('.errors').css("display", "block");
	    			$('.errors').fadeOut(4000);
	    		}	
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
		$(".errors").val("");
      	$('.errors').css("display", "none");
      	dialogOpen=false;
      }
    });
$( ".dialog-publish" ).dialog({
      autoOpen: false,
      height: 400,
      width: 450,
      modal: true,      
      show: "fold",
      hide: "fold",

      buttons: {
        "Publish": function() {
		 			
        	for(m in publishMaps){
          	$.post("database.php", {
		 					action: "publishmap",
		 					title: publishMaps[m]
		 				}, 
		 				function(data){
		 					data = JSON.parse(data);
		 					console.log(data.message);
			      
						}, "text");
          }
          	$( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
      	dialogOpen=false;
      }
    });

$( ".dialog-unpublish" ).dialog({
      autoOpen: false,
      height: 400,
      width: 450,
      modal: true,      
      show: "fold",
      hide: "fold",

      buttons: {
        "Unpublish": function() {
		 			
        	for(m in publishMaps){
          	$.post("database.php", {
		 					action: "hidemap",
		 					title: publishMaps[m]
		 				}, 
		 				function(data){
		 					data = JSON.parse(data);
		 					console.log(data.message);
			        	    
			      
						}, "text");
          }
          	$( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
      	dialogOpen=false;
      }
    });

$( ".dialog-hotKeys" ).dialog({
      autoOpen: false,
      height: 300,
      width: 300,
      modal: true,      
      show: "clip",
      hide: "clip",
      buttons: {
        Close: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
      	dialogOpen=false;
      }
    });
});
