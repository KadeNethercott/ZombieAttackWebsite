$(document).ready(function(){
	
var map = {
  title: "start map",
  author: "nethkade",
  width: 15,
  height: 15,
  x: 4,
  y: 4,
  data: {
    bottom: [
     	[22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
      [22, 0, 8,16,22,22,22,22,22,22,22,22,22,22,22],
      [22, 1, 9, 8,16,22,22,22,22,22,22,22,22,22,22],
      [22, 1, 9, 9,17,22,22,22,22,22,22,22,22,22,22],
      [22, 2, 0, 9, 8,16,22,22,22,22,22,22,22,22,22],
      [22,22, 1, 9, 9, 8, 8,16,22,22,22,22,22,22,22],
      [22,22, 2, 4, 9, 9, 9, 8,16,22,22,22,22,22,22],
      [22,22,22, 2,10, 4, 9, 9, 8,16,22,22,22,22,22],
      [22,22,22,22,22, 2, 4, 9, 9,17,22,22,22,22,22],
      [22,22,22,22,22,22, 2, 4, 9,17,22,22,22,22,22],
      [22,22,22,22,22,22,22, 2,10,18,22,22,22,22,22],
      [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
      [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
      [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
      [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22]
    ],
    middle:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    top:[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
  },
  events: [],
  env: "normal"
};



//constructor for map object
var Tiles = function(cSize, rSize, TileImage){
	this.colSize = cSize;
	this.rowSize = rSize;
	this.image = TileImage;
	this.tilesArray = new Array();
	this.create = function(contextTiles){
		//draw the tile image to allow it to be broken up into tiles

		contextTiles.drawImage(this.image,0,0);
		var img;
		var m_canvas;
		var m_context;
		//loop through the image and break it into 40x40 px tiles	
		for( var y=0;  y<this.rowSize; y++) {
			for(var x=0; x<this.colSize; x++){
				m_canvas= document.createElement('canvas');
				m_canvas.width = 40;
				m_canvas.height = 40;
				m_context = m_canvas.getContext('2d');

				m_context.drawImage(this.image,(x*40),(y*40),40,40,0,0,40,40);
				//contextTiles.getImageData((x*40),(y*40),40,40);
				this.tilesArray.push(m_canvas);
			}
		}
	};

	this.draw = function(contextTiles){
		//clear out tiles
		contextTiles.clearRect(0,0,320,360);
		//Display the tiles that can be chosen in the tiles canvas
		var img = new Image();
		for( var y=0, item=0; y<this.rowSize; y++){
			for(var x=0; x<this.colSize; x++, item++){
				
				contextTiles.drawImage(this.tilesArray[item],(x*40),(y*40));
			}
		}
	};
};


var mapCanvas = $("#mapCanvas");
var contextMap= mapCanvas.get(0).getContext("2d");

var bottomImageTiles = new Image();
bottomImageTiles.src = "img/bottom.png";

var middleImageTiles = new Image();
middleImageTiles.src = "img/middle.png";

var topImageTiles = new Image();
topImageTiles.src = "img/upper.png";

var eventImageTiles = new Image();
eventImageTiles.src =  "img/events.png";
	

var bottomTiles = new Tiles(8,9,bottomImageTiles);
var middleTiles = new Tiles(8,9,middleImageTiles);
var topTiles = new Tiles(8,9,topImageTiles);
var eventTiles = new Tiles(8,9,eventImageTiles);



var paintMap = function(){
		//console.log(contextMap);
		contextMap.clearRect(0,0,600,600);
		var img = new Image();
		for( var y=0; y<map.height; y++){
			for(var x=0; x<map.width;x++){
				var tileIndex= map.data.bottom[y][x];
				if(tileIndex!== -1){
					//console.log(bottomTiles.tilesArray[tileIndex]);
					//img.src=bottomTiles.tilesArray[tileIndex];
					contextMap.drawImage(bottomTiles.tilesArray[tileIndex],(x*25),(y*25),25,25);
				}
				tileIndex= map.data.middle[y][x];
				if(tileIndex!== -1){
					contextMap.drawImage(middleTiles.tilesArray[tileIndex],(x*25),(y*25),25,25);		
				}
				tileIndex=map.data.top[y][x];	
				if(tileIndex!== -1){
					contextMap.drawImage(topTiles.tilesArray[tileIndex],(x*25),(y*25),25,25);
				}
			}
		}
		var mEvent= {};
		for(var e in map.events){
			mEvent = map.events[e]
			if(mEvent.id=="treasure"){
				contextMap.drawImage(eventTiles.tilesArray[0],(mEvent.x*25),(mEvent.y*25),25,25);
			}
			if(mEvent.id=="bush"){
				contextMap.drawImage(eventTiles.tilesArray[1],(mEvent.x*25),(mEvent.y*25),25,25);
			}		
			if(mEvent.id=="hole"){
				contextMap.drawImage(eventTiles.tilesArray[2],(mEvent.x*25),(mEvent.y*25),25,25);
			}
			if(mEvent.id=="door"){
				contextMap.drawImage(eventTiles.tilesArray[3],(mEvent.x*25),(mEvent.y*25),25,25);
			}	
		}
	
		//console.log("ending paintMap");
	};


$(middleImageTiles).load(function(){
	bottomTiles.create(contextMap);
	contextMap.clearRect(0,0,320,360);
	middleTiles.create(contextMap);
	contextMap.clearRect(0,0,320,360);
	topTiles.create(contextMap);
	contextMap.clearRect(0,0,320,360);
	eventTiles.create(contextMap);
	contextMap.clearRect(0,0,320,360);
	var loadedMap = false;
	var id = 0;
$('.maps').click(function(e){
	id = e.target.id;

	$.post("database.php", {
		action: "getPlayableMap",
		mapId: id
		}, 
		function(data){
			data = JSON.parse(data);
			console.log(data.message);
			if(data.data instanceof Object){
			 	map=data.data;
			 	console.log('ready to paint');
			 	console.log(map.data);
	           	$("#canvasName").text(map.title);
	           	$('#mapAuthor').text("By " + map.author);
		      	paintMap();
		      	loadedMap = true;
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
	
	});
	$('.playButton').click(function(e){
		if(loadedMap){
			var path = '/play.php?mapid='+id;
			//var path = "/group3/code/play.php?mapid="+id;
			window.location.href= path;
			}
		});
	
	});

});