
$(document).ready(function() {
	$(".tC").hide();
	$(".mC").hide();
	highLightLayer($('#bottomTiles'), $('#middleTiles'), $('#eventTiles'), $('#topTiles'));
	highLightTool($('#brush'), $('#selector'), $('#eraser'));
	/*
	highLightLayer($('.layersB'), $('.layersM'), $('.layersE'), $('.layersT'));
	highLightTool($('.toolB'), $('.toolS'), $('.toolE'));
	*/
	$(".tC").slideDown(2000);
	
	//wait until the image is loaded before continuing
	$(middleImageTiles).load(function(){

		create2DArray(map.data.bottom);
		create2DArray(map.data.middle);
		create2DArray(map.data.top);
		
		bottomTiles.create(contextTiles);
		contextTiles.clearRect(0,0,320,360);
		middleTiles.create(contextTiles);
		contextTiles.clearRect(0,0,320,360);
		topTiles.create(contextTiles);
		contextTiles.clearRect(0,0,320,360);
		eventTiles.create(contextTiles);
		contextTiles.clearRect(0,0,320,360);
		
		
		currentTiles.draw(contextTiles);
		
		copyObjects(undoRedoArray[0], map);//create the first map in the undoredo array
		
		paintMap();
		
		tileBrushLeftClick=0; //set up initial brush positions
		tileBrushRightClick=3;
		leftClickSelectedX = 0;
		leftClickSelectedY = 0;
		rightClickSelectedX = 3;
		rightClickSelectedY = 0;

		//select the tile to paint with
		$("#upperTilesCanvas").mousedown(function(e){
		//get the position of the mouse within the tiles
			var xy = mousePosInCanvas($("#tilesCanvas"), e);
			var Xpos= xy[0];
			var Ypos= xy[1];
			//console.log(Xpos + " : " + Ypos);
			selectStartPos=xy;
			var XposMin = 0;
			var XposMax = 7;
			var YposMin = 0;
			var YposMax = 8;
			mouseButtonClicked = e.which;
			if(currentTool=='brush'|| currentTool =='eraser'){
				if(currentTilesLevel=="bottom"){
					YposMax = 5;
				}
				if(currentTilesLevel=="top"){
					YposMax = 0;
				}
				if(currentTilesLevel=="event"){
					YposMax = 0;
					XposMax = 4;
				}
				if(Xpos >=0 && Ypos >= 0 && Xpos <=XposMax && Ypos<=YposMax){
					if(e.which == 1){
						leftClickSelectedX = Xpos;
						leftClickSelectedY= Ypos;
						currentTiles.drawTilesGrid(currentTiles.colSize, currentTiles.rowSize, contextTiles);
						//get the number of the tile based off of the mouse position
						tileBrushLeftClick=((Xpos) + (Ypos*8));
					}
					if(e.which == 3){
						rightClickSelectedX = Xpos;
						rightClickSelectedY= Ypos;
						currentTiles.drawTilesGrid(currentTiles.colSize, currentTiles.rowSize, contextTiles);
					//get the number of the tile based off of the mouse position
						tileBrushRightClick=((Xpos) + (Ypos*8));	
					}
				}
			}
			if(currentTilesLevel!="event"){

				if(currentTool=="selector"){
					if(mouseButtonClicked===1){
						currentTiles.draw(contextTiles);
						drawSquare(Xpos*40,Ypos*40,40,40,'limegree#00FF00', contextTiles);
						var selectedTile=((Xpos) + (Ypos*8));

						if(currentTilesLevel=="bottom"){
							selectedArea.bottom.topLCX = Xpos;
							selectedArea.bottom.topLCY = Ypos;
							selectedArea.bottom.cols = 1;
							selectedArea.bottom.rows =1;
							selectedArea.bottom.tiles.length =0;
							selectedArea.bottom.tiles.push(selectedTile);

						}
						if(currentTilesLevel=="middle"){
							selectedArea.middle.topLCX = Xpos;
							selectedArea.middle.topLCY = Ypos;
							selectedArea.middle.cols = 1;
							selectedArea.middle.rows =1;
							selectedArea.middle.tiles.length =0;
							selectedArea.middle.tiles.push(selectedTile);
						}
						if(currentTilesLevel=="top"){
							selectedArea.top.topLCX = Xpos;
							selectedArea.top.topLCY = Ypos;
							selectedArea.top.cols = 1;
							selectedArea.top.rows =1;
							selectedArea.top.tiles.length =0;
							selectedArea.top.tiles.push(selectedTile);
						}
					}
				}	
			}
		});
	$('#upperTilesCanvas').mouseup(function(e){
		mouseButtonClicked =0;
	})
	//highlight the square where the mouse is at
	$("#upperTilesCanvas").mousemove(function(e){
		
		var xy = mousePosInCanvas($("#tilesCanvas"), e);
		var xy2 = mousePosInCanvas(this, e);
		var Xpos= xy[0];
		var Ypos= xy[1];
		if(currentTool=="brush" || currentTool=="eraser"){
		var XposMin = 0;
		var XposMax = 7;
		var YposMin = 0;
		var YposMax = 8;
		
		if(currentTilesLevel=="bottom"){
			YposMax = 5;
		}
		if(currentTilesLevel=="top"){
			YposMax = 0;
		}
		if(currentTilesLevel=="event"){
			YposMax = 0;
			XposMax = 4;
		}
		if(Xpos >=0 && Ypos >= 0 && Xpos <=XposMax && Ypos<=YposMax){
			contextUpperTiles.clearRect(0,0,350,390);
			var enlargedTile=((Xpos) + (Ypos*8));
			currentTiles.drawTilesGrid(currentTiles.colSize, currentTiles.rowSize, contextTiles);

			contextUpperTiles.rect((rightClickSelectedX*40)+8, (rightClickSelectedY*40)+4, 56,56);
			contextUpperTiles.fillStyle="gray";
			contextUpperTiles.shadowColor="black";
			contextUpperTiles.shadowBlur = 15;
			contextUpperTiles.shadowOffsetX = 5;
			contextUpperTiles.shadowOffsetY = 5;
			contextUpperTiles.fill();

			contextUpperTiles.rect((leftClickSelectedX*40)+8, (leftClickSelectedY*40)+4, 56,56);
			
			contextUpperTiles.fillStyle="gray";
			contextUpperTiles.shadowColor="black";
			contextUpperTiles.shadowBlur = 15;
			contextUpperTiles.shadowOffsetX = 5;
			contextUpperTiles.shadowOffsetY = 5;
			contextUpperTiles.fill();
			
			if(currentTilesLevel=="bottom"){
				contextUpperTiles.drawImage(bottomTiles.tilesArray[tileBrushRightClick],((rightClickSelectedX)*40)+10,((rightClickSelectedY)*40)+6,50,50);
				contextUpperTiles.drawImage(bottomTiles.tilesArray[tileBrushLeftClick],((leftClickSelectedX)*40)+10,((leftClickSelectedY)*40)+6,50,50);	
			}
			if(currentTilesLevel=="middle"){
			contextUpperTiles.drawImage(middleTiles.tilesArray[tileBrushRightClick],((rightClickSelectedX)*40)+10,((rightClickSelectedY)*40)+6,50,50);
				contextUpperTiles.drawImage(middleTiles.tilesArray[tileBrushLeftClick],((leftClickSelectedX)*40)+10,((leftClickSelectedY)*40)+6,50,50);	
			}
			if(currentTilesLevel=="top"){
			contextUpperTiles.drawImage(topTiles.tilesArray[tileBrushRightClick],((rightClickSelectedX)*40)+10,((rightClickSelectedY)*40)+6,50,50);
				contextUpperTiles.drawImage(topTiles.tilesArray[tileBrushLeftClick],((leftClickSelectedX)*40)+10,((leftClickSelectedY)*40)+6,50,50);	
			}
			if(currentTilesLevel=="event"){
			contextUpperTiles.drawImage(eventTiles.tilesArray[tileBrushRightClick],((rightClickSelectedX)*40)+10,((rightClickSelectedY)*40)+6,50,50);
				contextUpperTiles.drawImage(eventTiles.tilesArray[tileBrushLeftClick],((leftClickSelectedX)*40)+10,((leftClickSelectedY)*40)+6,50,50);	
			}
			
			contextUpperTiles.drawImage(redBlood,(rightClickSelectedX*40)+8,(rightClickSelectedY*40)+4, 50,50)
			contextUpperTiles.drawImage(greenBlood,(leftClickSelectedX*40)+8,(leftClickSelectedY*40)+4, 50,50)	
			contextUpperTiles.beginPath();
	
			contextUpperTiles.rect((Xpos*40)+6, (Ypos*40)+3, 58,58);
			
			contextUpperTiles.fillStyle="gray";
			contextUpperTiles.shadowColor="black";
			contextUpperTiles.shadowBlur = 15;
			contextUpperTiles.shadowOffsetX = 5;
			contextUpperTiles.shadowOffsetY = 5;
			contextUpperTiles.fill();

			contextUpperTiles.rect((Xpos*40)+6, (Ypos*40)+2, 58,58);
			contextUpperTiles.strokeStyle="rgba(152,210,177, 0.9)";
			
			contextUpperTiles.lineWidth="2";

			contextUpperTiles.stroke();

			if(currentTilesLevel=="bottom"){
				contextUpperTiles.drawImage(bottomTiles.tilesArray[enlargedTile],((Xpos)*40)+10,((Ypos)*40)+6,50,50);
			}
			if(currentTilesLevel=="middle"){
				contextUpperTiles.drawImage(middleTiles.tilesArray[enlargedTile],((Xpos)*40)+10,((Ypos)*40)+6,50,50);
			}
			if(currentTilesLevel=="top"){
				contextUpperTiles.drawImage(topTiles.tilesArray[enlargedTile],((Xpos)*40)+10,((Ypos)*40)+6,50,50);
			}
			if(currentTilesLevel=="event"){
				contextUpperTiles.drawImage(eventTiles.tilesArray[enlargedTile],((Xpos)*40)+10,((Ypos)*40)+6,50,50);
			}

		}
	}
	if(currentTilesLevel!="event"){

		if(currentTool=="selector"){
			if(mouseButtonClicked===1){
				if(selectStartPos[0]!=Xpos || selectStartPos[1]!=Ypos){

					var topLeftCornerX = Xpos<selectStartPos[0] ? Xpos : selectStartPos[0];
					var topLeftCornerY=Ypos<selectStartPos[1] ? Ypos : selectStartPos[1];
					var bottomRightCornerX = Xpos>selectStartPos[0] ? Xpos : selectStartPos[0];
					var bottomRightCornerY= Ypos>selectStartPos[1] ? Ypos : selectStartPos[1];
					var rectWidth = (Math.abs(topLeftCornerX - bottomRightCornerX)+1)*40;
					var rectHeight = (Math.abs(topLeftCornerY - bottomRightCornerY)+1)*40;
					
					if(rectWidth==0){
						rectWidth=40;
					}
					if(rectHeight==0){
						rectHeight=40;
					}
					//console.log("TopLeft" + topLeftCornerX + ", "+ topLeftCornerY + "Width:" + rectWidth + "Height:" + rectHeight);
					currentTiles.draw(contextTiles);
					drawSquare(topLeftCornerX*40, topLeftCornerY*40, rectWidth, rectHeight, '#00FF00', contextTiles );

					if(currentTilesLevel=="bottom"){
						createSelectedArea(selectedArea.bottom,topLeftCornerX, topLeftCornerY, bottomRightCornerX, bottomRightCornerY, 'tiles');
					}
					if(currentTilesLevel=="middle"){
						createSelectedArea(selectedArea.middle,topLeftCornerX, topLeftCornerY, bottomRightCornerX, bottomRightCornerY, 'tiles');
					}
					if(currentTilesLevel=="top"){
						createSelectedArea(selectedArea.top,topLeftCornerX, topLeftCornerY, bottomRightCornerX, bottomRightCornerY, 'tiles');	
					}
										//console.log("rows: " + selectedArea.rows + ", cols:" + selectedArea.columns + ", tiles: " +selectedArea.tiles);
				}
				else{
					currentTiles.draw(contextTiles);
					drawSquare(Xpos*40,Ypos*40,40,40,'#00FF00', contextTiles);
					var selectedTile=((Xpos) + (Ypos*8));
					if(currentTilesLevel=="bottom"){
						selectedArea.bottom.topLCX = topLeftCornerX;
						selectedArea.bottom.topLCY = topLeftCornerY;
						selectedArea.bottom.cols = 1;
						selectedArea.bottom.rows =1;
						selectedArea.bottom.tiles.length =0;
						selectedArea.bottom.tiles.push(selectedTile);

					}
					if(currentTilesLevel=="middle"){
						selectedArea.middle.topLCX = topLeftCornerX;
						selectedArea.middle.topLCY = topLeftCornerY;
						selectedArea.middle.cols = 1;
						selectedArea.middle.rows =1;
						selectedArea.middle.tiles.length =0;
						selectedArea.middle.tiles.push(selectedTile);
					}
					if(currentTilesLevel=="top"){
						selectedArea.top.topLCX = topLeftCornerX;
						selectedArea.top.topLCY = topLeftCornerY;
						selectedArea.top.cols = 1;
						selectedArea.top.rows =1;
						selectedArea.top.tiles.length =0;
						selectedArea.top.tiles.push(selectedTile);
					}	
				}
			}
		}
		}
	});


	$("#upperTilesCanvas").bind('contextmenu', function(e){
    	e.preventDefault();
	});
	
	$("#upperTilesCanvas").mouseenter(function(e){
		if(currentTool=='selector'){
			contextUpperTiles.clearRect(0,0,350,390);
		}
	});
	//take off the highlights tile since mouse is out of canvas area
	$("#upperTilesCanvas").mouseleave(function(e){
		contextUpperTiles.clearRect(0,0,350,390);
		//console.log("left upper tiles");
		if(currentTool!='selector'){
		currentTiles.drawTilesGrid(currentTiles.colSize, currentTiles.rowSize, contextTiles);
		contextUpperTiles.beginPath();
			
		contextUpperTiles.rect((rightClickSelectedX*40)+8, (rightClickSelectedY*40)+4, 56,56);
			
			contextUpperTiles.fillStyle="gray";
			contextUpperTiles.shadowColor="black";
			contextUpperTiles.shadowBlur = 15;
			contextUpperTiles.shadowOffsetX = 5;
			contextUpperTiles.shadowOffsetY = 5;
			contextUpperTiles.fill();

			contextUpperTiles.rect((leftClickSelectedX*40)+8, (leftClickSelectedY*40)+4, 56,56);
			
			contextUpperTiles.fillStyle="gray";
			contextUpperTiles.shadowColor="black";
			contextUpperTiles.shadowBlur = 15;
			contextUpperTiles.shadowOffsetX = 5;
			contextUpperTiles.shadowOffsetY = 5;
			contextUpperTiles.fill();
		//drawSquare((rightClickSelectedX*40)+8, (rightClickSelectedY*40)+4, 55, 55, "blue", contextUpperTiles);
		
		if(currentTilesLevel=="bottom"){
			contextUpperTiles.drawImage(bottomTiles.tilesArray[tileBrushRightClick],((rightClickSelectedX)*40)+10,((rightClickSelectedY)*40)+6,50,50);
			contextUpperTiles.drawImage(bottomTiles.tilesArray[tileBrushLeftClick],((leftClickSelectedX)*40)+10,((leftClickSelectedY)*40)+6,50,50);	
		}
		if(currentTilesLevel=="middle"){
			contextUpperTiles.drawImage(middleTiles.tilesArray[tileBrushRightClick],((rightClickSelectedX)*40)+10,((rightClickSelectedY)*40)+6,50,50);
			contextUpperTiles.drawImage(middleTiles.tilesArray[tileBrushLeftClick],((leftClickSelectedX)*40)+10,((leftClickSelectedY)*40)+6,50,50);	
		}
		if(currentTilesLevel=="top"){
		contextUpperTiles.drawImage(topTiles.tilesArray[tileBrushRightClick],((rightClickSelectedX)*40)+10,((rightClickSelectedY)*40)+6,50,50);
		contextUpperTiles.drawImage(topTiles.tilesArray[tileBrushLeftClick],((leftClickSelectedX)*40)+10,((leftClickSelectedY)*40)+6,50,50);	
		}
		if(currentTilesLevel=="event"){
			contextUpperTiles.drawImage(eventTiles.tilesArray[tileBrushRightClick],((rightClickSelectedX)*40)+10,((rightClickSelectedY)*40)+6,50,50);
			contextUpperTiles.drawImage(eventTiles.tilesArray[tileBrushLeftClick],((leftClickSelectedX)*40)+10,((leftClickSelectedY)*40)+6,50,50);	
		}

		contextUpperTiles.drawImage(redBlood,(rightClickSelectedX*40)+8,(rightClickSelectedY*40)+4, 50,50)
		contextUpperTiles.drawImage(greenBlood,(leftClickSelectedX*40)+8,(leftClickSelectedY*40)+4, 50,50)
	}
	});


	//paint the new tile on the map
	$("#mapCanvas").mousedown( function(e){
	
			var xy = mousePosInCanvas(this, e);
			selectStartPos=xy;
			var Xpos= xy[0];
			var Ypos= xy[1];
			mouseButtonClicked = e.which;

			var brush = "";
		if(currentTilesLevel!='event'){ //non event tools
			if(currentTool=="brush"){
				var mapChanged=false;
				if(mouseButtonClicked===1){
					mapChanged=assignTileBrushToMap(tileBrushLeftClick, Xpos, Ypos);
				}
				if(mouseButtonClicked===3){
					mapChanged=assignTileBrushToMap(tileBrushRightClick, Xpos, Ypos);	
				}
				if(mapChanged){
					paintMap();
				}
			}
			if(currentTool=="selector"){
				if(mouseButtonClicked===1){
					paintMap();
					drawSquare(Xpos*40,Ypos*40,40,40, '#00FF00',contextMap);
					var topLeftCornerX = Xpos;
					var topLeftCornerY = Ypos; 
				if(currentTilesLevel=="bottom"){
						selectedArea.bottom.topLCX = topLeftCornerX;
						selectedArea.bottom.topLCY = topLeftCornerY;
						selectedArea.bottom.cols = 1;
						selectedArea.bottom.rows =1;
						selectedArea.bottom.tiles.length =0;
						selectedArea.bottom.tiles.push(map.data.bottom[Ypos][Xpos]);

					}
					if(currentTilesLevel=="middle"){
						selectedArea.middle.topLCX = topLeftCornerX;
						selectedArea.middle.topLCY = topLeftCornerY;
						selectedArea.middle.cols = 1;
						selectedArea.middle.rows =1;
						selectedArea.middle.tiles.length =0;
						selectedArea.middle.tiles.push(map.data.middle[Ypos][Xpos]);
					}
					if(currentTilesLevel=="top"){
						selectedArea.top.topLCX = topLeftCornerX;
						selectedArea.top.topLCY = topLeftCornerY;
						selectedArea.top.cols = 1;
						selectedArea.top.rows =1;
						selectedArea.top.tiles.length =0;
						selectedArea.top.tiles.push(map.data.top[Ypos][Xpos]);
					}		
				}
				
			}
			if(currentTool=="eraser"){
					//console.log("inside eraser")
					if(mouseButtonClicked==1 || mouseButtonClicked==3){
						mapChanged=assignTileBrushToMap(-1, Xpos, Ypos);	
						paintMap();	
					}	
				}
		}
		else{ //tools for events
			if(currentTool=="brush"){

				var mapChanged=false;
				if(mouseButtonClicked===1){
					assignEventToMap(tileBrushLeftClick, Xpos, Ypos);

				}
				if(mouseButtonClicked===3){
					assignEventToMap(tileBrushRightClick, Xpos, Ypos);	
				}
				
			}
			if(currentTool=="selector"){
				if(mouseButtonClicked===1){
				var clickedOnEvent = false;	
				var clickedEvent = new Object();
					for(var e in map.events){
						if(map.events[e].x == Xpos && map.events[e].y == Ypos){
							clickedOnEvent=true;
							clickedEvent=map.events[e];
						}
					}
					if(clickedOnEvent == true){
						if(clickedEvent.id == "treasure"){
							newEvent.x = clickedEvent.x;
							newEvent.y = clickedEvent.y;
							var eventItem ="";
							if(clickedEvent.item==1){
								eventItem = "Shot Gun";
							}
							if(clickedEvent.item==2){
								eventItem = "Knife";
							}
							if(clickedEvent.item==3){
								eventItem = "Machine Gun";
							}
							$("#tBoxItem").val(eventItem);
							dialogOpen = true; //disable hotkeys
							$('.dialog-treasure').dialog('open');

						}
						if(clickedEvent.id == "hole"){
							newEvent.x = clickedEvent.x;
							newEvent.y = clickedEvent.y;
							$("#hDid").val(clickedEvent.d_id);
							$("#hDxLoc").val(clickedEvent.d_x);
							$("#hDyLoc").val(clickedEvent.d_y);
							setUpDialog($('.dialog-hole'));
							//dialogOpen = true;	//disable hotkeys				
							//$('.dialog-hole').dialog("open");
						}
						if(clickedEvent.id == "door"){
							newEvent.x = clickedEvent.x;
							newEvent.y = clickedEvent.y;
							$("#dDid").val(clickedEvent.d_id);
							$("#dDxLoc").val(clickedEvent.d_x);
							$("#dDyLoc").val(clickedEvent.d_y);
							setUpDialog($('.dialog-door'));
							//dialogOpen = true; //disable hotkeys
							//$('.dialog-door').dialog("open");
						}
					}
					}
				}
					if(currentTool=="eraser"){
						if(mouseButtonClicked==1 || mouseButtonClicked==3){
							var clickedOnEvent = false;	
							var clickedEvent = new Object();
							for(var e in map.events){
								if(map.events[e].x == Xpos && map.events[e].y == Ypos){
									map.events.splice(e,1);	
									undoRedoPos++;
									undoRedoArray[undoRedoPos] = new Object();
									copyObjects(undoRedoArray[undoRedoPos],map);
								}
						}
					}
				}
			paintMap();
			drawSquare(Xpos*40,Ypos*40,40,40, '#00FF00',contextMap);
		}

	});
	$('#mapCanvas').mouseup(function(e){
		mouseButtonClicked =0;
	})

	//highlight the tile under the mouse in the map canvas
	$("#mapCanvas").mousemove(function(e){
		e.preventDefault();
		var xy = mousePosInCanvas(this, e);
		var Xpos= xy[0];
		var Ypos= xy[1];
	if(currentTilesLevel!='event'){	
		
		if(currentTool=="brush"){
			var mapChanged = false;
			if(mouseButtonClicked===1){
				mapChanged=assignTileBrushToMap(tileBrushLeftClick, Xpos, Ypos);
			}
			if(mouseButtonClicked===3){
				mapChanged=assignTileBrushToMap(tileBrushRightClick, Xpos, Ypos);	
			}
			
		paintMap();
		drawSquare(Xpos*40, Ypos*40, 40, 40, "#00FF00", contextMap);
		}
		if(currentTool=="selector"){	
			if(mouseButtonClicked===1){
				if(selectStartPos[0]!=Xpos || selectStartPos[1]!=Ypos){

					var topLeftCornerX = Xpos<selectStartPos[0] ? Xpos : selectStartPos[0];
					var topLeftCornerY=Ypos<selectStartPos[1] ? Ypos : selectStartPos[1];
					var bottomRightCornerX = Xpos>selectStartPos[0] ? Xpos : selectStartPos[0];
					var bottomRightCornerY= Ypos>selectStartPos[1] ? Ypos : selectStartPos[1];
					var rectWidth = (Math.abs(topLeftCornerX - bottomRightCornerX)+1)*40;
					var rectHeight = (Math.abs(topLeftCornerY - bottomRightCornerY)+1)*40;
					
					if(rectWidth==0){
						rectWidth=40;
					}
					if(rectHeight==0){
						rectHeight=40;
					}
					//console.log("TopLeft" + topLeftCornerX + ", "+ topLeftCornerY + "Width:" + rectWidth + "Height:" + rectHeight);
					paintMap();
					drawSquare(topLeftCornerX*40, topLeftCornerY*40, rectWidth, rectHeight, '#00FF00', contextMap );

					if(currentTilesLevel=="bottom"){
						createSelectedArea(selectedArea.bottom,topLeftCornerX, topLeftCornerY, bottomRightCornerX, bottomRightCornerY, 'map');
					}
					if(currentTilesLevel=="middle"){
						createSelectedArea(selectedArea.middle,topLeftCornerX, topLeftCornerY, bottomRightCornerX, bottomRightCornerY, 'map');
					}
					if(currentTilesLevel=="top"){
						createSelectedArea(selectedArea.top,topLeftCornerX, topLeftCornerY, bottomRightCornerX, bottomRightCornerY, 'map');	
					}
										//console.log("rows: " + selectedArea.rows + ", cols:" + selectedArea.columns + ", tiles: " +selectedArea.tiles);
				}
				else{
					paintMap();
					drawSquare(Xpos*40,Ypos*40,40,40,'#00FF00', contextMap);
					
					if(currentTilesLevel=="bottom"){
						selectedArea.bottom.topLCX = topLeftCornerX;
						selectedArea.bottom.topLCY = topLeftCornerY;
						selectedArea.bottom.cols = 1;
						selectedArea.bottom.rows =1;
						selectedArea.bottom.tiles.length =0;
						selectedArea.bottom.tiles.push(map.data.bottom[Ypos][Xpos]);

					}
					if(currentTilesLevel=="middle"){
						selectedArea.middle.topLCX = topLeftCornerX;
						selectedArea.middle.topLCY = topLeftCornerY;
						selectedArea.middle.cols = 1;
						selectedArea.middle.rows =1;
						selectedArea.middle.tiles.length =0;
						selectedArea.middle.tiles.push(map.data.middle[Ypos][Xpos]);
					}
					if(currentTilesLevel=="top"){
						selectedArea.top.topLCX = topLeftCornerX;
						selectedArea.top.topLCY = topLeftCornerY;
						selectedArea.top.cols = 1;
						selectedArea.top.rows =1;
						selectedArea.top.tiles.length =0;
						selectedArea.top.tiles.push(map.data.top[Ypos][Xpos]);
					}	
				}
			}
		}
		if(currentTool=="eraser"){
			//console.log("inside eraser")
				if(mouseButtonClicked==1 || mouseButtonClicked==3){
					mapChanged=assignTileBrushToMap(-1, Xpos, Ypos);	
			}
			paintMap();
			drawSquare(Xpos*40,Ypos*40,40,40,'#00FF00', contextMap);	
		}

	}
	else{
			paintMap();
			drawSquare(Xpos*40,Ypos*40,40,40,'#00FF00', contextMap);
	}	
	});

	$("#mapCanvas").bind('contextmenu', function(e){
		e.preventDefault();
	});	
	//repaint the map after mouse leaves to erase highlighted tile
	$("#mapCanvas").mouseleave(function(e){
		if(currentTool=="brush")
		{
			paintMap();		
		}
	});

	$('#bottomTiles').click(function(e){
		tileBrushLeftClick=0; //set up initial brush positions
		tileBrushRightClick=3;
		leftClickSelectedX = 0;
		leftClickSelectedY = 0;
		rightClickSelectedX = 3;
		rightClickSelectedY = 0;
		$(".tC").hide();	
		$(".tC").slideDown(800);	
		currentTiles = bottomTiles;
		currentTilesLevel = "bottom";
		currentMapLevel = "bottom";

		contextTiles.clearRect(0,0,320,360);
		highLightLayer($('#bottomTiles'), $('#middleTiles'), $('#eventTiles'), $('#topTiles'));
		contextTiles.canvas.width = 320;
		contextTiles.canvas.height = 240;
		contextUpperTiles.canvas.width = 350;
		contextUpperTiles.canvas.height = 275;
		$('.tilesUpper').css('top',"20%");
		$('.tilesUpper').css('left',"0%");
		$('.tiles').css('margin-left','0px')
		currentTiles.draw(contextTiles);
		$(".displayLevel").text("Bottom");		

	});

	$('#middleTiles').click(function(e){
		tileBrushLeftClick=0; //set up initial brush positions
		tileBrushRightClick=3;
		leftClickSelectedX = 0;
		leftClickSelectedY = 0;
		rightClickSelectedX = 3;
		rightClickSelectedY = 0;
		$(".tC").hide();
		$(".tC").slideDown(800);
		currentTiles = middleTiles;
		currentTilesLevel = "middle";
		currentMapLevel = "middle";
		highLightLayer($('#middleTiles'), $('#bottomTiles'),  $('#eventTiles'), $('#topTiles'));
		contextTiles.canvas.width = 320;
		contextTiles.canvas.height = 360;
		contextUpperTiles.canvas.width = 350;
		contextUpperTiles.canvas.height = 385;
		$('.tilesUpper').css('top',"14%");
		$('.tilesUpper').css('left',"0%");
		$('.tiles').css('margin-left','0px')
		currentTiles.draw(contextTiles);
		$(".displayLevel").text("Middle");
	});

	$('#topTiles').click(function(e){
		tileBrushLeftClick=0; //set up initial brush positions
		tileBrushRightClick=3;
		leftClickSelectedX = 0;
		leftClickSelectedY = 0;
		rightClickSelectedX = 3;
		rightClickSelectedY = 0;
		$(".tC").hide();	
		$(".tC").slideDown(800);
		currentTiles = topTiles;
		currentTilesLevel = "top";
		currentMapLevel = "top";
		highLightLayer( $('#topTiles'), $('#middleTiles'), $('#bottomTiles'),  $('#eventTiles'));
		contextTiles.canvas.width = 320;
		contextTiles.canvas.height = 40;
		contextUpperTiles.canvas.width = 350;
		contextUpperTiles.canvas.height = 70;
		$('.tilesUpper').css('top',"30%");
		$('.tiles').css('margin-left','0px')
		$('.tilesUpper').css('left','0%')
		currentTiles.draw(contextTiles);
		$(".displayLevel").text("Top");
	});

	$('#eventTiles').click(function(e){
		tileBrushLeftClick=0; //set up initial brush positions
		tileBrushRightClick=3;
		leftClickSelectedX = 0;
		leftClickSelectedY = 0;
		rightClickSelectedX = 3;
		rightClickSelectedY = 0;
		$(".tC").hide();	
		$(".tC").slideDown(800);	
		currentTiles = eventTiles;
		currentTilesLevel = "event";
		currentMapLevel = "event";
		highLightLayer( $('#eventTiles'), $('#topTiles'), $('#middleTiles'), $('#bottomTiles') );

		contextTiles.canvas.width = 200;
		contextTiles.canvas.height = 40;
		contextUpperTiles.canvas.width = 240;
		contextUpperTiles.canvas.height = 80;
		$('.tilesUpper').css('top',"30%");
		$('.tiles').css('margin-left','50px')
		$('.tilesUpper').css('left','11%')
		currentTiles.draw(contextTiles);
		$(".displayLevel").text("Event");
	});

	$("#copyMap").click(function(e){

		copyMap();

	});

	$("#pasteMap").click(function(e){

		pasteMap();
	});

	$("#undoMap").click(function(e){
		if(undoRedoPos > 0){
			undoRedoPos--;
			copyObjects(map, undoRedoArray[undoRedoPos])
			paintMap();	
		}
	});

	$("#redoMap").click(function(e){
		if(undoRedoPos < undoRedoArray.length-1){
			undoRedoPos++;
			copyObjects(map, undoRedoArray[undoRedoPos]);
			paintMap();			
		}
	});

	$("#gridOn").click(function(e){
		gridStatus= "on";
		paintMap();
	});

	$("#gridOff").click(function(e){
		gridStatus = "off";
		paintMap();
	});


	$("#publish").click(function(e){
		$('.d-forms').css("display", "inline");
	dialogOpen = true;
	publishMaps.length = 0
	$(".ownedMaps").empty();
	$(".publishMaps").empty();
	$(".unpublishMaps").empty();
	  $.post("database.php",{
        	 action: "getUnpublishedMaps"
       		},
   			function(data){
   				pubMaps=data.data;
   				for(var m in pubMaps){
					$(".unpublishMaps").append("<div class='clickedPName' id=\'" + pubMaps[m].name + "\'>" + pubMaps[m].name + "</div>" )
     	 		}
     			$('.dialog-publish').dialog('open');
     	 	}, "json");
		
	});

	$("#unpublish").click(function(e){
		//console.log("clicked unpublish");
		$('.d-forms').css("display", "inline");
		dialogOpen = true;
		publishMaps.length = 0;
		$(".ownedMaps").empty();
		$(".publishMaps").empty();
		$(".unpublishMaps").empty();
	  $.post("database.php",{
        	 action: "getPublishedMaps"
       		},
   			function(data){
   				console.log(data.message);
   				pubMaps=data.data; 				
   				for(var m in pubMaps){
					$(".publishMaps").append("<div class='clickedPName' id=\'" + pubMaps[m].name + "\'>" + pubMaps[m].name + "</div>" )
     	 		}
     			$('.dialog-unpublish').dialog('open');
     	 	}, "json");
	});

	


	$("#brush").click(function(e){
		currentTool="brush";
		highLightTool($('#brush'), $('#selector'), $('#eraser'));
		
	});

	$("#selector").click(function(e){
		currentTool="selector";
		highLightTool($('#selector'), $('#brush'), $('#eraser'));
	
	});

	$("#eraser").click(function(e){
		currentTool="eraser";
		highLightTool($('#eraser'), $('#selector'), $('#brush'));
	
	});

	$(".dialog-newMap").keydown(function(e){

    	if (e.keyCode == $.ui.keyCode.ENTER) 
    	{
          e.preventDefault();
	      dialog = $(".dialog-newMap").dialog("option");
	      dialog.buttons.Create();
      	}
    });

    $(".dialog-openMap").keydown(function(e){
    	
    	if (e.keyCode == $.ui.keyCode.ENTER) {
          e.preventDefault();
	      dialog = $(".dialog-openMap").dialog("option");
	      dialog.buttons.Open();
	  	}
    });

    $(".dialog-saveAsMap").keydown(function(e){
    	if (e.keyCode == $.ui.keyCode.ENTER){
			e.preventDefault();
	     	dialog = $(".dialog-saveAsMap").dialog("option");
	     	dialog.buttons["Save As"]();
    	}
 	 });
    $(".dialog-randomMap").keydown(function(e){
    	if (e.keyCode == $.ui.keyCode.ENTER){
			e.preventDefault();
	     	dialog = $(".dialog-randomMap").dialog("option");
	     	dialog.buttons["Create"]();
    	}
 	 });
    $(".dialog-treasure").keydown(function(e){
    	if (e.keyCode == $.ui.keyCode.ENTER){
			e.preventDefault();
	     	dialog = $(".dialog-treasure").dialog("option");
	     	dialog.buttons["Submit"]();
    	}
 	 });
    $(".dialog-hole").keydown(function(e){
    	if (e.keyCode == $.ui.keyCode.ENTER){
			e.preventDefault();
	     	dialog = $(".dialog-hole").dialog("option");
	     	dialog.buttons["Submit"]();
    	}
 	 });
    $(".dialog-door").keydown(function(e){
    	if (e.keyCode == $.ui.keyCode.ENTER){
			e.preventDefault();
	     	dialog = $(".dialog-door").dialog("option");
	     	dialog.buttons["Submit"]();
    	}
 	 });
    $(".dialog-publish").keydown(function(e){
    	if (e.keyCode == $.ui.keyCode.ENTER){
			e.preventDefault();
	     	dialog = $(".dialog-publish").dialog("option");
	     	dialog.buttons["Publish"]();
    	}
 	 });
    $(".dialog-unpublish").keydown(function(e){
    	if (e.keyCode == $.ui.keyCode.ENTER){
			e.preventDefault();
	     	dialog = $(".dialog-unpublish").dialog("option");
	     	dialog.buttons["Unpublish"]();
    	}
 	 });

    $( "#newMap" ).click(function() {
        setUpDialog($( ".dialog-newMap" ));
      });

	$("#openMap").click(function(e){
		setUpDialog($( ".dialog-openMap" ));
		
	});

	$("#saveMap").click(function(e){
		
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
		)		
	});
	
	$("#saveAsMap").click(function(e){
		setUpDialog($( ".dialog-saveAsMap" ));
	});

	$("#hotKeys").click(function(e){
		$('.d-forms').css("display", "inline");
		dialogOpen=true;
		$('.dialog-hotKeys').dialog('open');

	});

	$("#genRandom").click(function(e){
		setUpDialog($( ".dialog-randomMap" ));
	});

	$('.ownedMaps').click(function(e){
			
		var id = e.target.id;	
		$('#openMapName').val(id);
		$('#newMapName').val(id);
		$('#saveAsMapName').val(id);
		$('#randomMapName').val(id);
		$('#dDid').val(id);
		$('#hDid').val(id);
		$('input').focus();
		
	});

	$('.publishMaps').click(function(e){
			
		var id = e.target.id;	
		var index = publishMaps.indexOf(id)
		if( index > -1){
			//console.log(id);
			publishMaps.splice(index, 1);
			//console.log(publishMaps)
			
			$('#'+id).removeClass("selectedMapName")
			$('#'+id).addClass("clickedPName");
			
		}
		else{
			publishMaps.push(id);
			//console.log(publishMaps);
			
			$('#'+id).removeClass("clickedPName")
			$('#'+id).addClass("selectedMapName");
		
		}
		$('button:eq(0)').focus();
	});
		$('.unpublishMaps').click(function(e){
			
		var id = e.target.id;	
		var index = publishMaps.indexOf(id)
		if( index > -1){
			//console.log(id);
			publishMaps.splice(index, 1);
			//console.log(publishMaps)
			
			$('#'+id).removeClass("selectedMapName")
			$('#'+id).addClass("clickedPName");
			
			
		}
		else{
			publishMaps.push(id);
			//console.log(publishMaps);
			
			$('#'+id).removeClass("clickedPName")
			$('#'+id).addClass("selectedMapName");
			
		}
		$('button:eq(0)').focus();
	});
	$('.gameItems').click(function(e){
			
		var id = e.target.id;	
		$('#tBoxItem').val(id);
		$('input').focus();
	});
	//----hotkeys

	$(document).keydown(function(e){
		//alert(e.which);
		//s-83, c-67, p-80, u-85, r-82, b-66, e-69, g-71

		if(dialogOpen == false){
			
			if(e.which == 83){
				currentTool='selector';
						highLightTool($('.toolS'), $('.toolE'), $('.toolB'));
			}
			if(e.which== 66){
				currentTool='brush';
				highLightTool($('.toolB'), $('.toolS'), $('.toolE'));
			}
			if(e.which== 69){
				currentTool='eraser';
						highLightTool($('.toolE'), $('.toolB'), $('.toolS'));
			}
			if(e.which==71){
				if(	gridStatus=="on"){
					gridStatus="off";
				}
				else{
					gridStatus="on";
				}
				paintMap();	
			}
			if(e.which==85){
				if(undoRedoPos > 0){
					undoRedoPos--;
					//console.log("map: " + map.events);
					//console.log("undoRedo: " + undoRedoArray[undoRedoPos].events);
					copyObjects(map, undoRedoArray[undoRedoPos]);
					paintMap();	
				}
			}
			if(e.which==82){
				if(undoRedoPos < undoRedoArray.length-1){
					undoRedoPos++;
					//console.log("map: " + map.events);
					//console.log("undoRedo: " + undoRedoArray[undoRedoPos].events);
					copyObjects(map, undoRedoArray[undoRedoPos]);
					paintMap();			
				}
			}
			if(e.which==67){
				copyMap();
			}
			if(e.which==80){
				pasteMap();
			}
		}
	});
	
	 });	
	
 });