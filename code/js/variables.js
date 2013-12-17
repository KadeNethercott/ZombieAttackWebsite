
/*@author Kade Nethercott*/

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

var drawGrid = function(colSize, rowSize, contextDraw){
	contextDraw.beginPath();
	contextDraw.strokeStyle="#404040";
	contextDraw.lineWidth="2";
	//draw row lines
	for(var r =0; r<rowSize+1; r++){
		contextDraw.moveTo(0,(r*40));
		contextDraw.lineTo((colSize*40),(r*40));
		contextDraw.stroke();
	}
		//draw column lines
	for(var c =0; c<colSize+1; c++){
		contextDraw.moveTo((c*40),0);
		contextDraw.lineTo((c*40),(rowSize*40));
		contextDraw.stroke();
	}		
};
 
 //constructor for map object
var Tiles = function(cSize, rSize, TileImage){
	this.colSize = cSize;
	this.rowSize = rSize;
	this.image = TileImage;
	this.tilesArray = new Array();
	this.drawTilesGrid = drawGrid;
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
		this.drawTilesGrid(this.colSize, this.rowSize, contextTiles);
	};
};

var create2DArray = function(newMap){
	for(var i =0; i<mapSize; i++){
		newMap[i]= [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
	}
};
var tilesCanvas = $("#tilesCanvas");
var contextTiles= tilesCanvas.get(0).getContext("2d");
var upperTilesCanvas = $("#upperTilesCanvas");
var contextUpperTiles = upperTilesCanvas.get(0).getContext("2d");

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

var greenBlood = new Image();
greenBlood.src = "img/greenBlood.png";

var redBlood = new Image();
redBlood.src = "img/redBlood.png";
	

var bottomTiles = new Tiles(8,9,bottomImageTiles);
var middleTiles = new Tiles(8,9,middleImageTiles);
var topTiles = new Tiles(8,9,topImageTiles);
var eventTiles = new Tiles(8,9,eventImageTiles);

var currentTiles = bottomTiles;
var currentTilesLevel = "bottom";
var currentMapLevel = "bottom";

//console.log(currentTilesLevel);

var gridStatus = "off";
var currentTool="brush";

var leftClickSelectedX = 0;
var leftClickSelectedY = 0;

var rightClickSelectedX = 3;
var rightClickSelectedY = 0;
var tileBrushLeftClick;
var tileBrushRightClick;
var tileBrushRightX = 0;
var tileBrushRightY =0;
var tileBrushLeftX = 0;
var tileBrushLeftY =0;
var mapSize = 15;
var undoRedoArray = new Array();
undoRedoArray[0]= new Object();
undoRedoArray[0].data= new Object();
undoRedoArray[0].data.bottom = new Array(mapSize);
undoRedoArray[0].data.middle = new Array(mapSize);
undoRedoArray[0].data.top = new Array(mapSize);

create2DArray(undoRedoArray[0].data.bottom);
create2DArray(undoRedoArray[0].data.middle);
create2DArray(undoRedoArray[0].data.top);
undoRedoArray[0].events = new Array();

var undoRedoPos = 0;
var mapChanged= false;

var selectStartPos = new Array(2);
selectStartPos[0]=0; //holds the x pos
selectStartPos[1]=0; //holds the y pos
var mouseButtonClicked = 0; //keeps track of left and right button clicks
var dialogOpen = false;
var ownedMaps = [];
var publishMaps = [];

var selectedArea ={
	bottom:{layer: "bottom",
			cols: 0,
			rows: 0,
			topLCX: 0,
			topLCY: 0,
			tiles: []},
	middle:{layer: "middle",
			cols: 0,
			rows: 0,
			topLCX: 0,
			topLCY: 0,
			tiles: []},
	top: {layer: "top", 
			cols: 0,
			rows: 0,
			topLCX: 0,
			topLCY: 0,
			tiles: []},
}; 

var copiedArea = {
	bottom:{layer: "bottom",
			cols: 0,
			rows: 0,
			tiles: [],
			numOfTiles: 0},
	middle:{layer: "middle",
			cols: 0,
			rows: 0,
			tiles: [],
			numOfTiles: 0},
	top:{layer: "top",
			cols: 0,
			rows: 0,
			tiles: [],
			numOfTiles: 0}
};

var assignTileBrushToMap = 	function(brush, Xpos, Ypos){
		mapChanged= false;
		//console.log(currentTilesLevel);

		if(currentTilesLevel=="bottom"){	
		//change the tile # in the bottom mapArray
			if(map.data.bottom[Ypos][Xpos]!= brush){
				map.data.bottom[Ypos][Xpos] = brush;
				//undoRedoPos++;
				mapChanged=true;
			}
		}
		if(currentTilesLevel=="middle"){	
			if(map.data.middle[Ypos][Xpos]!= brush){	
				map.data.middle[Ypos][Xpos] = brush;
				//undoRedoPos++;
				mapChanged=true;
			}
		}
		if(currentTilesLevel=="top"){	
			if(map.data.top[Ypos][Xpos]!= brush){	
				map.data.top[Ypos][Xpos] = brush;
				//undoRedoPos++;
				mapChanged=true;
			}
		}
		
		//add the new updated map to the undoredo array
		if(mapChanged){
			undoRedoPos++;
			undoRedoArray[undoRedoPos] = new Object();
			copyObjects(undoRedoArray[undoRedoPos],map);
		}
		return mapChanged;
	};

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
					contextMap.drawImage(bottomTiles.tilesArray[tileIndex],(x*40),(y*40));
				}
				tileIndex= map.data.middle[y][x];
				if(tileIndex!== -1){
					contextMap.drawImage(middleTiles.tilesArray[tileIndex],(x*40),(y*40));		
				}
				tileIndex=map.data.top[y][x];	
				if(tileIndex!== -1){
					contextMap.drawImage(topTiles.tilesArray[tileIndex],(x*40),(y*40));
				}

			}
			
		}
		var mEvent= {};
		for(var e in map.events){
			mEvent = map.events[e]
			if(mEvent.id=="treasure"){
				contextMap.drawImage(eventTiles.tilesArray[0],(mEvent.x*40),(mEvent.y*40));
			}
			if(mEvent.id=="bush"){
				contextMap.drawImage(eventTiles.tilesArray[1],(mEvent.x*40),(mEvent.y*40));
			}		
			if(mEvent.id=="hole"){
				contextMap.drawImage(eventTiles.tilesArray[2],(mEvent.x*40),(mEvent.y*40));
			}
			if(mEvent.id=="door"){
				contextMap.drawImage(eventTiles.tilesArray[3],(mEvent.x*40),(mEvent.y*40));
			}	
		}
	
		if(gridStatus==="on"){
			drawGrid(map.height,map.width,contextMap);
		}
		//console.log("ending paintMap");
	};


var drawGrid = function(colSize, rowSize, contextDraw){
	contextDraw.beginPath();
	contextDraw.strokeStyle="#404040";
	contextDraw.lineWidth="2";
	//draw row lines
	for(var r =0; r<rowSize+1; r++){
		contextDraw.moveTo(0,(r*40));
		contextDraw.lineTo((colSize*40),(r*40));
		contextDraw.stroke();
	}
		//draw column lines
	for(var c =0; c<colSize+1; c++){
		contextDraw.moveTo((c*40),0);
		contextDraw.lineTo((c*40),(rowSize*40));
		contextDraw.stroke();
	}		
};

var drawSquare = function(xPos, yPos, xSize, ySize, color, contextDraw){
	//console.log(xPos + ", " + yPos + ", " + ySize + ", " + xSize + ":");
	contextDraw.beginPath();
	contextDraw.strokeStyle=color;
	contextDraw.lineWidth="2";

	contextDraw.rect(xPos, yPos, xSize,ySize);
	contextDraw.stroke();
};

var copyObjects = function(copyTo, copyFrom){
	//copyTo = new Object();
	//copyTo = $.extend({},copyFrom);
	//console.log("starting copy objects");
	copyTo.data= new Object();
	copyTo.data.bottom = new Array(mapSize);
	copyTo.data.middle = new Array(mapSize);
	copyTo.data.top = new Array(mapSize);
	
	create2DArray(copyTo.data.bottom);
	create2DArray(copyTo.data.middle);
	create2DArray(copyTo.data.top);
	copyTo.events = new Array();
	copyTo.title = copyFrom.title;
	copyTo.author = copyFrom.author;
	copyTo.width = copyFrom.width;
	copyTo.height = copyFrom.height;
	copyTo.x = copyFrom.x;
	copyTo.y = copyFrom.y;
	copyArrays(copyTo.data.bottom, copyFrom.data.bottom);
	copyArrays(copyTo.data.middle, copyFrom.data.middle);
	copyArrays(copyTo.data.top, copyFrom.data.top);
	
	for(var e in copyFrom.events){
		copyTo.events[e]= new Object();
		for(var o in copyFrom.events[e]){
			copyTo.events[e][o]=copyFrom.events[e][o];
		}

	}
//	console.log("exiting copy objects")

};

var copyArrays = function(copyTo, copyFrom){
	for(var z=0;z<copyFrom.length; z++)
	{
		copyTo[z]=copyFrom[z].slice();	
	}	
};
	
var mousePosInCanvas = function(currentCanvas, e){

	var x = e.pageX-$(currentCanvas).offset().left;
	var y = e.pageY-$(currentCanvas).offset().top;
		
	//console.log(x + " " + y);
	var Xpos = Math.floor((x)/40);
	var Ypos = Math.floor((y)/40);
	var xy = [Xpos,Ypos];
		//console.log(Xpos + " " + Ypos);
	return xy;
};



var highLightTool = function(tool1, tool2, tool3){
	tool1.removeClass("toolUnselected").addClass("toolSelected")
	tool2.removeClass("toolSelected").addClass("toolUnselected")
	tool3.removeClass("toolSelected").addClass("toolUnselected")	

};
var highLightLayer = function(layer1, layer2, layer3,layer4){
	layer1.removeClass("layerUnselected").addClass("layerSelected")
	layer2.removeClass("layerSelected").addClass("layerUnselected")
	layer3.removeClass("layerSelected").addClass("layerUnselected")	
	layer4.removeClass("layerSelected").addClass("layerUnselected")		
};


var createSelectedArea = function(sArea,topLeftCornerX, topLeftCornerY, bottomRightCornerX, bottomRightCornerY, loc){
	sArea.topLCX = topLeftCornerX;
	sArea.topLCY = topLeftCornerY;
	sArea.cols= (Math.abs(topLeftCornerX - bottomRightCornerX)+1);
	sArea.rows = (Math.abs(topLeftCornerY - bottomRightCornerY)+1);
	sArea.tiles.length =0;
	if(loc=='map'){
		for(var i =topLeftCornerY; i<=bottomRightCornerY; i++){
			for(var j=topLeftCornerX; j<=bottomRightCornerX; j++){	
				///console.log("row: " + i + ", col: " + j + "tile: " + map.data.bottom[i][j]);
					sArea.tiles.push(map.data[sArea.layer][i][j]);
			}
		}
	}
	if(loc=='tiles'){
		var tilesNum =0;
		if(sArea.layer=='bottom'){
			for(var i =topLeftCornerY; i<=bottomRightCornerY; i++){
				for(var j=topLeftCornerX; j<=bottomRightCornerX; j++){	
					///console.log("row: " + i + ", col: " + j + "tile: " + map.data.bottom[i][j]);
					tilesNum = (j + (i*8));
					sArea.tiles.push(tilesNum);
				}
			}
		}
		if(sArea.layer=='middle'){
			for(var i =topLeftCornerY; i<=bottomRightCornerY; i++){
				for(var j=topLeftCornerX; j<=bottomRightCornerX; j++){	
					///console.log("row: " + i + ", col: " + j + "tile: " + map.data.bottom[i][j]);
					tilesNum = (j + (i*8));
					sArea.tiles.push(tilesNum);
				}
			}
		}
		if(sArea.layer=='top'){
			for(var i =topLeftCornerY; i<=bottomRightCornerY; i++){
				for(var j=topLeftCornerX; j<=bottomRightCornerX; j++){	
					///console.log("row: " + i + ", col: " + j + "tile: " + map.data.bottom[i][j]);
					tilesNum = (j + (i*8));
					sArea.tiles.push(tilesNum);
				}
			}
		}
		
	}

}
var pasteMap = function(){
//	console.log("starting pasteMap");

//console.log(copiedArea[currentTilesLevel].tiles[0]);
//console.log(copiedArea[currentTilesLevel].tiles[1])
//console.log(copiedArea.bottom.tiles[0]);
//console.log(copiedArea.bottom.tiles[1]);
//console.log(copiedArea.bottom.numOfTiles);
	if(copiedArea[currentTilesLevel].numOfTiles!= 0)
		{
			var startX = selectedArea[currentTilesLevel].topLCX;
			var startY = selectedArea[currentTilesLevel].topLCY;
			var endX = startX + copiedArea[currentTilesLevel].cols;
			var endY = startY + copiedArea[currentTilesLevel].rows;
			//console.log(startX + ", " + startY + ": " + endX + ", " + endY);
			for(var i = startY, copyRow =0; i<endY; i++, copyRow++)
			{
				if(i >= map.height)
				{
					break;
				}
				for(var j=startX, copyCol =0; j<endX; j++, copyCol++)
				{
					if(j >= map.width)
					{
						break;
					}
					
					if(currentTilesLevel=="bottom"){

						map.data.bottom[i][j] = copiedArea.bottom.tiles[copyRow][copyCol];
					}
					if(currentTilesLevel=="middle"){
						map.data.middle[i][j] = copiedArea.middle.tiles[copyRow][copyCol];
					}
					if(currentTilesLevel=="top"){
						map.data.top[i][j] = copiedArea.top.tiles[copyRow][copyCol];
					}	
				}
				//console.log(copiedArea.bottom.tiles);
				//console.log(map.data.bottom);
			}
			//console.log("inside paste");
			//console.log("bottom");
	//console.log(selectedArea.bottom.tiles);
	
			undoRedoPos++;
			undoRedoArray[undoRedoPos]= new Object();
			copyObjects(undoRedoArray[undoRedoPos], map);
			paintMap();
	}
//		console.log("ending pasteMap");
};

var copyMap = function(){
	
	copiedArea[currentTilesLevel].cols = selectedArea[currentTilesLevel].cols;
	copiedArea[currentTilesLevel].rows = selectedArea[currentTilesLevel].rows;
	copiedArea[currentTilesLevel].tiles = new Array(selectedArea[currentTilesLevel].rows);
	copiedArea[currentTilesLevel].numOfTiles = selectedArea[currentTilesLevel].tiles.length;
		
	//console.log(selectedArea[currentTilesLevel].length);
	//console.log(copiedArea[currentTilesLevel].numOfTiles);
	for(var i = 0, index=0; i<copiedArea[currentTilesLevel].rows; i++){
		copiedArea[currentTilesLevel].tiles[i] = new Array(selectedArea[currentTilesLevel].cols);

		for(var j=0; j<copiedArea[currentTilesLevel].cols; j++, index++){
			copiedArea[currentTilesLevel].tiles[i][j] = selectedArea[currentTilesLevel].tiles[index];
		}
	}


			undoRedoPos++;
			undoRedoArray[undoRedoPos]= new Object();
			copyObjects(undoRedoArray[undoRedoPos], map);
			paintMap();
		
	
};

//auto save every 20 seconds

setInterval(function(){
	$.post("database.php",{
			action: "savemap",
			title: map.title,
			height: map.height,
			width: map.width,
			overwrite: true,
			data: JSON.stringify(map)
			}, 
			function(data){
				console.log(data.message);
			},"json"
	)},20000);



var setUpDialog= function(currentDialog){
	$('#openMapName').val("");
	$('#newMapName').val("");
	$('#saveAsMapName').val("");
	$('#randomMapName').val("");
	$("#tBoxItem").val("");
	$('.d-forms').css("display", "inline");
	
	dialogOpen = true;

	$(".ownedMaps").empty();
	  $.post("database.php",{
        	 action: "getownedmaps"
       		},
   			function(data){
   				ownedMaps=data.data;
   				for(var m in ownedMaps){
					$(".ownedMaps").append("<div class='clickedMapName' id=\'" + ownedMaps[m].name + "\'>" + ownedMaps[m].name + "</div>" )
     	 		}
     			currentDialog.dialog( "open" );
     	 	}, "json");
};


var searchEvents = function(event1){

	//console.log("inside SearchEvents");
	for(var e in map.events){
		if(map.events[e].x == event1.x && map.events[e].y == event1.y){
		
			map.events[e].id=event1.id;
			if(event1.id=="treasure"){
				map.events[e].item=event1.item;
			}
			if(event1.id=="hole"){
				map.events[e].d_id=event1.d_id;
				map.events[e].d_y=event1.d_y;
				map.events[e].d_x=event1.d_x;
			}
			if(event1.id=="door"){
				map.events[e].d_id=event1.d_id;
				map.events[e].d_y=event1.d_y;
				map.events[e].d_x=event1.d_x;
			}
			//console.log("exiting SearchEvents");
			return true;	
		}

	}
	//console.log("exiting SearchEvents");
	map.events.push(event1);
	return false;
};


var newEvent = new Object();
newEvent.x=0;
newEvent.y=0;
var assignEventToMap = function(brush, Xpos, Ypos){

	//console.log(brush);
	newEvent.x=Xpos;
	newEvent.y=Ypos;
	
	if(brush==0){
		dialogOpen = true;
		
		$("#tBoxItem").val("");
		//console.log("open dialog treasure");
		dialogOpen = true;

		$('.dialog-treasure').dialog("open");							
	}
	if(brush==1){
			var bush = new Object();
	       	bush.id = "bush";
	       	bush.x = newEvent.x;
	       	bush.y = newEvent.y;
	      	searchEvents(bush);	
	      	undoRedoPos++;
			undoRedoArray[undoRedoPos]= new Object();
			copyObjects(undoRedoArray[undoRedoPos], map);						
	}
	if(brush==2){
		dialogOpen = true;
		
		$("#hDid").val("");
		$("#hDxLoc").val("");
		$("#hDyLoc").val("");
		//console.log("open dialog hole");
		setUpDialog($('.dialog-hole'));
						
	}
	if(brush==3 || brush ==4){
		dialogOpen = true;
		
		$("#dDid").val("");
		$("#dDxLoc").val("");
		$("#dDyLoc").val("");
//		console.log("open dialog door");
		setUpDialog($('.dialog-door'));						
	}
	
};

var genRandom = function genRandomMap(newMapBottom, newMapMiddle, newMapTop)
{
	
	//used to monitor what spaces we've placed objects in.
	//initially no objects are placed.
	var usedSpace = new Array();
	for(var i=0; i<15; ++i)
	{
		usedSpace[i] = new Array();
		for(var j=0; j<15; ++j)
		{
			usedSpace[i][j] = false;
		}
	}
	
	//create empty map.
	for(var i=0; i<15; i++)
	{
		newMapBottom[i] = new Array();
		for(var j=0; j<15; j++)
		{
			newMapMiddle[i][j] = -1;
			newMapTop[i][j] = -1;
		}
	}
	map.events.length = 0;
	
	
	//place big piece in map
	var rowPos = 0;
	var colPos = Math.floor((Math.random()*12));
	var temprow = rowPos;
	var tempcol = colPos;
	
	newMapBottom[rowPos][colPos] = 0;
	newMapBottom[rowPos][colPos+1] = 1;
	newMapBottom[rowPos][colPos+2] = 1;
	newMapBottom[rowPos][colPos+3] = 2;
	for(var i= rowPos+1; i<rowPos+4; ++i)
	{
		newMapBottom[i][colPos] = 8;
		newMapBottom[i][colPos+1] = 9;
		newMapBottom[i][colPos+2] = 9;
		newMapBottom[i][colPos+3] = 10;
	}
	newMapBottom[rowPos+4][colPos] = 16;
	newMapBottom[rowPos+4][colPos+1] = 17;
	newMapBottom[rowPos+4][colPos+2] = 17;
	newMapBottom[rowPos+4][colPos+3] = 18;
	
	//add middle and top layers to make house
	var middleColPos = colPos;
	if(colPos == 0)
		middleColPos = 1;
	
	newMapMiddle[rowPos][middleColPos] = 59;
	newMapMiddle[rowPos+1][middleColPos] = 67;
	newMapMiddle[rowPos+2][middleColPos] = 67;
	newMapMiddle[rowPos+3][middleColPos] = 56;
	newMapMiddle[rowPos+4][middleColPos] = 64;
	newMapMiddle[rowPos+4][middleColPos+1] = 65;
	newMapMiddle[rowPos+3][middleColPos+1] = 57;
	newMapMiddle[rowPos+2][middleColPos+1] = 68;
	newMapMiddle[rowPos+1][middleColPos+1] = 68;
	newMapMiddle[rowPos][middleColPos+1] = 60;
	newMapMiddle[rowPos][middleColPos+2] = 61;
	newMapMiddle[rowPos+1][middleColPos+2] = 69;
	newMapMiddle[rowPos+2][middleColPos+2] = 69;
	newMapMiddle[rowPos+3][middleColPos+2] = 58;
	newMapMiddle[rowPos+4][middleColPos+2] = 66;
	
	
	var topColPos = middleColPos - 1;
	newMapTop[rowPos][topColPos] = 0;
	newMapTop[rowPos+1][topColPos] = 4;
	newMapTop[rowPos+2][topColPos] = 4;
	newMapTop[rowPos+3][topColPos] = 2;
	newMapTop[rowPos][topColPos+4] = 1;
	newMapTop[rowPos+1][topColPos+4] = 5;
	newMapTop[rowPos+2][topColPos+4] = 5;
	newMapTop[rowPos+3][topColPos+4] = 3;
	
	var event = new Object();
	event.y = rowPos+4;
	event.x = middleColPos+1;
	event.id = "door";
	event.d_id = 1;
	event.d_x = 1;
	event.d_y = 1;
	map.events.push(event);
	
	//fill usedSpace for big piece
	for(var i=rowPos; i<rowPos+5; ++i)
	{
		for(var j=colPos; j<colPos+4; ++j)
		{
			usedSpace[i][j] = true;
		}
	}
	
	//place next big piece
	//here we check our starting position to make sure it doesn't overlap
	while(true)
	{
		var rowPos = 0;
		var colPos = Math.floor((Math.random()*12));
		var break1 = true;
		for(var i=rowPos; i<rowPos+5; ++i)
		{
			for(var j=colPos; j<colPos+4; ++j)
			{
				if(usedSpace[i][j] == true)
					break1 = false;
				
				if(Math.abs(colPos - tempcol) < 6)
					break1 = false;
			}
		}
		if(break1)
			break;
	}
	
	newMapBottom[rowPos][colPos] = 0;
	newMapBottom[rowPos][colPos+1] = 1;
	newMapBottom[rowPos][colPos+2] = 1;
	newMapBottom[rowPos][colPos+3] = 2;
	for(var i= rowPos+1; i<rowPos+4; ++i)
	{
		newMapBottom[i][colPos] = 8;
		newMapBottom[i][colPos+1] = 9;
		newMapBottom[i][colPos+2] = 9;
		newMapBottom[i][colPos+3] = 10;
	}
	newMapBottom[rowPos+4][colPos] = 16;
	newMapBottom[rowPos+4][colPos+1] = 17;
	newMapBottom[rowPos+4][colPos+2] = 17;
	newMapBottom[rowPos+4][colPos+3] = 18;
	
	var middleColPos = colPos;
	if(colPos == 0)
		middleColPos = 1;
	
	newMapMiddle[rowPos][middleColPos] = 59;
	newMapMiddle[rowPos+1][middleColPos] = 67;
	newMapMiddle[rowPos+2][middleColPos] = 67;
	newMapMiddle[rowPos+3][middleColPos] = 56;
	newMapMiddle[rowPos+4][middleColPos] = 64;
	newMapMiddle[rowPos+4][middleColPos+1] = 65;
	newMapMiddle[rowPos+3][middleColPos+1] = 57;
	newMapMiddle[rowPos+2][middleColPos+1] = 68;
	newMapMiddle[rowPos+1][middleColPos+1] = 68;
	newMapMiddle[rowPos][middleColPos+1] = 60;
	newMapMiddle[rowPos][middleColPos+2] = 61;
	newMapMiddle[rowPos+1][middleColPos+2] = 69;
	newMapMiddle[rowPos+2][middleColPos+2] = 69;
	newMapMiddle[rowPos+3][middleColPos+2] = 58;
	newMapMiddle[rowPos+4][middleColPos+2] = 66;
	
	var topColPos = middleColPos - 1;
	newMapTop[rowPos][topColPos] = 0;
	newMapTop[rowPos+1][topColPos] = 4;
	newMapTop[rowPos+2][topColPos] = 4;
	newMapTop[rowPos+3][topColPos] = 2;
	newMapTop[rowPos][topColPos+4] = 1;
	newMapTop[rowPos+1][topColPos+4] = 5;
	newMapTop[rowPos+2][topColPos+4] = 5;
	newMapTop[rowPos+3][topColPos+4] = 3;
	
	var event = new Object();
	event.y = rowPos+4;
	event.x = middleColPos+1;
	event.id = "door";
	event.d_id = 1;
	event.d_x = 1;
	event.d_y = 1;
	map.events.push(event);
	
	//fill usedSpace for big piece
	for(var i=rowPos; i<rowPos+5; ++i)
	{
		for(var j=colPos; j<colPos+4; ++j)
		{
			usedSpace[i][j] = true;
		}
	}
	
	//connect two pieces
	connecting(rowPos, colPos, [5,4], temprow, tempcol, [5,4], newMapBottom, usedSpace);
	temprow = rowPos;
	tempcol = colPos;
	
	//place little piece
	while(true)
	{
		var rowPos = Math.floor((Math.random()*13));
		var colPos = Math.floor((Math.random()*13));
		var break1 = true;
		for(var i=rowPos; i<rowPos+3; ++i)
		{
			for(var j=colPos; j<colPos+3; ++j)
			{
				if(usedSpace[i][j] == true)
					break1 = false;
			}
		}
		if(break1)
			break;
	}
	newMapBottom[rowPos][colPos] = 0;
	newMapBottom[rowPos][colPos+1] = 1;
	newMapBottom[rowPos][colPos+2] = 2;
	newMapBottom[rowPos+1][colPos] = 8;
	newMapBottom[rowPos+1][colPos+1] = 9;
	newMapBottom[rowPos+1][colPos+2] = 10;
	newMapBottom[rowPos+2][colPos] = 16;
	newMapBottom[rowPos+2][colPos+1] = 17;
	newMapBottom[rowPos+2][colPos+2] = 18;
	
	var event = new Object();
	event.y = rowPos+1;
	event.x = colPos+1;
	event.id = "treasure";
	event.item = 1;
	map.events.push(event);
	
	
	//fill usedSpace for little piece
	for(var i=rowPos; i<rowPos+3; ++i)
	{
		for(var j=colPos; j<colPos+3; ++j)
		{
			usedSpace[i][j] = true;
		}
	}
	
	//connect two pieces
	connecting(rowPos, colPos, [3,3], temprow, tempcol, [5,4], newMapBottom, usedSpace);
	temprow = rowPos;
	tempcol = colPos;
	
	//place final little piece
	while(true)
	{
		var rowPos = Math.floor((Math.random()*13));
		var colPos = Math.floor((Math.random()*12));
		var break1 = true;
		for(var i=rowPos; i<rowPos+3; ++i)
		{
			for(var j=colPos; j<colPos+4; ++j)
			{
				if(usedSpace[i][j] == true)
					break1 = false;
			}
		}
		if(break1)
			break;
	}
	newMapBottom[rowPos][colPos] = 0;
	newMapBottom[rowPos][colPos+1] = 1;
	newMapBottom[rowPos][colPos+2] = 1;
	newMapBottom[rowPos][colPos+3] = 2;
	newMapBottom[rowPos+1][colPos] = 8;
	newMapBottom[rowPos+1][colPos+1] = 9;
	newMapBottom[rowPos+1][colPos+2] = 9;
	newMapBottom[rowPos+1][colPos+3] = 10;
	newMapBottom[rowPos+2][colPos] = 16;
	newMapBottom[rowPos+2][colPos+1] = 17;
	newMapBottom[rowPos+2][colPos+2] = 17;
	newMapBottom[rowPos+2][colPos+3] = 18;
	for(var i=rowPos; i<rowPos+3; ++i)
	{
		for(var j=colPos; j<colPos+4; ++j)
		{
			usedSpace[i][j] = true;
		}
	}
	newMapMiddle[rowPos+1][colPos+1] = 54;
	newMapMiddle[rowPos+1][colPos+2] = 55;
	
	newMapMiddle[rowPos][colPos+1] = 43;
	newMapMiddle[rowPos][colPos+2] = 43;
	newMapMiddle[rowPos+2][colPos+1] = 43
	newMapMiddle[rowPos+2][colPos+2] = 43
	
	//connect two pieces
	connecting(rowPos, colPos, [3,3], temprow, tempcol, [3,3], newMapBottom, usedSpace);
	temprow = rowPos;
	tempcol = colPos;
	
	//fill in patches/grass
	for(var i=0; i<13; ++i)
	{
		var openfield = true;
		for(var j=0; j<13; ++j)
		{
			if( !usedSpace[i][j] &&
				!usedSpace[i+1][j] &&
				!usedSpace[i+2][j] &&
				!usedSpace[i][j+1] &&
				!usedSpace[i+1][j+1] &&
				!usedSpace[i+2][j+1] &&
				!usedSpace[i][j+2] &&
				!usedSpace[i+1][j+2] &&
				!usedSpace[i+2][j+2]
			){
				var choice = Math.floor(Math.random()*20);
				if(choice == 1)
				{
					newMapBottom[i][j] = 5;
					newMapBottom[i][j+1] = 6;
					newMapBottom[i+1][j] = 13;
					newMapBottom[i+1][j+1] = 14;
					
					if(Math.floor(Math.random()*2) < 1)
					{
					newMapMiddle[i+1][j+1] = 63;
					newMapTop[i][j+1] = 7;
					}
					usedSpace[i][j] = true;
					usedSpace[i][j+1] = true;
					usedSpace[i+1][j] = true;
					usedSpace[i+1][j+1] = true;
				}
				if(choice == 2)
				{
					newMapBottom[i][j] = 19;
					newMapBottom[i][j+1] = 20;
					newMapBottom[i][j+2] = 21;
					newMapBottom[i+1][j] = 27;
					newMapBottom[i+1][j+1] = 28;
					newMapBottom[i+1][j+2] = 29;
					newMapBottom[i+2][j] = 35;
					newMapBottom[i+2][j+1] = 36;
					newMapBottom[i+2][j+2] = 37;
					usedSpace[i][j] = true;
					usedSpace[i][j+1] = true;
					usedSpace[i][j+2] = true;
					usedSpace[i+1][j] = true;
					usedSpace[i+1][j+1] = true;
					usedSpace[i+1][j+2] = true;
					usedSpace[i+2][j] = true;
					usedSpace[i+2][j+1] = true;
					usedSpace[i+2][j+2] = true;
				}
			}
		}
	}
	//finish by filling in grass for all unused squares
	for(var i=0; i<15; ++i)
	{
		for(var j=0; j<15; ++j)
		{
			if(usedSpace[i][j] == false)
			{
				newMapBottom[i][j] = 22;
				if(newMapMiddle[i][j] == -1)
				{
					if(Math.floor(Math.random()*70 < 2))
					{
						newMapMiddle[i][j] = 70;
					}
					if(Math.floor(Math.random()*70 < 2))
					{
						newMapMiddle[i][j] = 44;
					}
				
				}
				
			}
		}
	}
	
	for(var i=0; i<14; ++i)
	{
		for(var j=0; j<15; ++j)
		{
			if(newMapMiddle[i][j] == -1 && newMapMiddle[i+1][j] == -1 
				&& newMapTop[i][j] == -1 && newMapTop[i+1][j] == -1 && usedSpace[i][j] == false)
			{
				if(Math.floor(Math.random()*70 < 2))
				{
				newMapTop[i][j] = 6;
				newMapMiddle[i+1][j] = 62;
				}
			}
		}
	}
};
var connecting = function connect(rowPos, colPos, size1, temprow, tempcol, size2, newMapBottom, usedSpace)
{
	var bridgeMade = false;
	var connected = false;
	var piece1 = false;
	if(rowPos < temprow )
	{
		piece1 = true;
		while(true)
		{
			if(rowPos + size1[0] >= temprow)
			{
				if(usedSpace[rowPos + size1[0]][colPos + Math.floor(size1[1]/2)])
				{
					connected = true;
					break;
				}
				newMapBottom[rowPos + size1[0]][colPos + Math.floor(size1[1]/2)] = 7;
				usedSpace[rowPos + size1[0]][colPos + Math.floor(size1[1]/2)] = true;
				bridgeMade = true;
				break;
			}
			else
			{
				if(usedSpace[rowPos + size1[0]][colPos + Math.floor(size1[1]/2)])
				{
					connected = true;
					break;
				}
				newMapBottom[rowPos + size1[0]][colPos + Math.floor(size1[1]/2)] = 7;
				bridgeMade = true;
				usedSpace[rowPos + size1[0]][colPos + Math.floor(size1[1]/2)] = true;
				rowPos++;
			}
		}
	}
	else
	{
		while(true)
		{
			if(temprow + size2[0] >= rowPos)
			{
				if(temprow + size2[0] >= 15)
					break;
				if(usedSpace[temprow + size2[0]][tempcol + Math.floor(size2[1]/2)])
					break;
				newMapBottom[temprow + size2[0]][tempcol + Math.floor(size2[1]/2)] = 7;
				bridgeMade = true;
				usedSpace[temprow + size2[0]][tempcol + Math.floor(size2[1]/2)] = true;
				break;
			}
			else
			{
				if(usedSpace[temprow + size2[0]][tempcol + Math.floor(size2[1]/2)])
					break;
				newMapBottom[temprow + size2[0]][tempcol + Math.floor(size2[1]/2)] = 7;
				bridgeMade = true;
				usedSpace[temprow + size2[0]][tempcol + Math.floor(size2[1]/2)] = true;
				temprow++;
			}
		}
	}
	if(bridgeMade)
	{
		rowPos = rowPos + size1[0];
		temprow = temprow + size2[0];
		if(piece1)
			colPos = colPos + Math.floor(size1[1]/2);
		else
			tempcol = tempcol + Math.floor(size2[1])/2;
		
		while(!connected)
		{
			if(piece1)
			{
				if(colPos < tempcol)
				{
					colPos++;
					if(usedSpace[rowPos][colPos])
						connected = true;
					else
					{
						newMapBottom[rowPos][colPos] = 7;
						usedSpace[rowPos][colPos] = true;
					}
				}
				else
				{
					colPos--;
					if(usedSpace[rowPos][colPos])
						connected = true;
					else
					{
						newMapBottom[rowPos][colPos] = 7;

						usedSpace[rowPos][colPos] = true;
					}
				}
			}
			else
			{
				if(colPos < tempcol)
				{
					tempcol--;
					if(usedSpace[temprow][tempcol])
						connected = true;
					else
					{
						newMapBottom[temprow][tempcol] = 7;
						usedSpace[temprow][tempcol] = true;
					}
				}
				else
				{
					tempcol++;
					if(usedSpace[temprow][tempcol])
						connected = true;
					else
					{
						newMapBottom[temprow][tempcol] = 7;
						usedSpace[temprow][tempcol] = true;
					}
				}
			}
		}
	}
};