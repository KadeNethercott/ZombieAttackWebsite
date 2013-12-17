

/*@author Michael Kushlan*/
 $(document).ready(function() {

var btn = $.fn.button.noConflict(); // reverts $.fn.button to jqueryui btn
$.fn.btn = btn; // assigns bootstrap button functionality to $.fn.btn

$( "#editprofile" ).click(function() {
   		$('.d-forms').css("display", "inline");
        $( ".dialog-editprofile" ).dialog("open");
		
		
	  });
	  
	 
 $( ".dialog-editprofile" ).dialog({
	autoOpen: false,
	height: 400,
	width: 450,
	modal: true,
	show: "drop",
	hide: "drop",
	buttons: {
		"Submit": function() {
		
		var aboutInfo = String($("#aboutInfo").val());
		var avatarImage;
		
		if(document.getElementById('av1').checked)
			{
				avatarImage = "zombie-01.png";
			}
		if(document.getElementById('av2').checked)
			{
				avatarImage = "zombie-02.png";
			}
		if(document.getElementById('av3').checked)
			{
				avatarImage = "zombie-03.png";
			}
		if(document.getElementById('av4').checked)
			{
				avatarImage = "zombie-04.png";
			}
		
		$.post("profile.php", { updateInfo : 1, avImage : avatarImage, abInfo: aboutInfo, usname: window.username},
			function(data,status){
				
			});
		
		window.location.reload();
		$(".dialog-editprofile").dialog( "close" );
		},
		"Exit": function() {
		$(".dialog-editprofile").dialog( "close" );
		}
	},
	close: function() {}
	});

	window.onload = function()
{
	getPublishedMaps();
	getUnpublishedMaps();
}
function getPublishedMaps()
{
	$.post("database.php",{
        	 action: "getPublishedMaps"
       		},
   			function(data){
   				
   				maps=data.data; 				
   				var pubmaps = document.getElementById('pmaps');
	
				for(var m in maps){
					pubmaps.innerHTML += "<div>" + maps[m].name + "</div>"
     	 		}
     	 	}, "json");
}

function getUnpublishedMaps()
{
	$.post("database.php",{
        	 action: "getUnpublishedMaps"
       		},
   			function(data){
   				maps=data.data;
				var upubmaps = document.getElementById('upmaps');
   				for(var m in maps){
					upubmaps.innerHTML += "<div class=\"text-center\">" + maps[m].name + "</div>"
     	 		}
     	 	}, "json");	
}
});

