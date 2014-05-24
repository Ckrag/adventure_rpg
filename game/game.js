/*
* INFO:
* game starts at line  55
* g_ are global vars
*/
//window.game['var'] = function()

//creating maincharacter causes problems, as it requires a position yet to be said, and will always force the character to be drawn at fallback

document.onkeydown = checkKey;

function checkKey(e) {
    var event = window.event ? window.event : e;
    if (game.g_docReady) {
        if(event.keyCode == 38)
        { 
        	game.entity.g_MainCharacter.Move("up");  	
        }
        if(event.keyCode == 40)
        { 
        	game.entity.g_MainCharacter.Move("down");
    	}
        if(event.keyCode == 37)
        { 
        	game.entity.g_MainCharacter.Move("left");
        }
        if(event.keyCode == 39)
        { 
        	game.entity.g_MainCharacter.Move("right");
        }
    }
	    
}

window.onload=function()
{
	game.g_canvas = document.getElementById("mygame");
	if(game.g_canvas.getContext)
	{
		game.g_ctx = game.g_canvas.getContext("2d");
	}
	game.g_canvas.width = game.g_canvasWidth;
	game.g_canvas.height = game.g_canvasHeight;

	//enables keylistener
	game.g_docReady = true;
	game.sprite.PreloadSprites();
}



var game = 
{
	//settings
	g_canvasHeight : 500,
	g_canvasWidth : 500,
	g_xAxisTiles : 50,
	g_yAxisTiles : 50,
	g_loopDelay : 33,

	//has to be atleast the size of axis tiles (MAKE AN AUTOCORRECT!)
	g_xGameviewSize : 10,
	g_yGameviewSize : 10,

	//has to be atleast 2 or higher
	g_movementViewDif : 2,

	//initial stuff
	g_canvas : null,
	g_ctx : null,
	g_docReady : false,

	g_gameLoopRunning : false,
	g_intervalLoop : null,

	InitiateGame : function ()
	{
		//called when sprites are ready
		game.PreStartSetup(); //stuff to be done before the game loop starts
		game.Start();
	},

	//gameGrid	
	gameGrid :
	{	
		/* grid tiles
		*[x, y, background,background object, moving object, foreground object]
		*/
		grid : [], 

		tileHeight : null,
		tileWidth : null,

		//topleft corner of viewgrid
		gameViewAnchor : null,
		
		GameGridSetup : function ()
		{
			game.gameGrid.BuildTiles();
			game.gameGrid.CalcViewAnchor();		
		},

		MoveView : function (direction)
		{
			var ancherRef = game.gameGrid.grid[game.gameGrid.gameViewAnchor];
			var tempCharPos = [];
			var tempAnchor = [];

			var up = false;
			var down = false;
			var left = false;
			var right = false;

			tempCharPos[0] = game.entity.g_MainCharacter.position[0];
			tempCharPos[1] = game.entity.g_MainCharacter.position[1];
			tempAnchor[0] = ancherRef[0];
			tempAnchor[1] = ancherRef[1];


			//console.log(tempCharPos[1] + "<" + (ancherRef[1] + game.g_yGameviewSize - game.g_movementViewDif));
			//only move screen if mainchar is too close to edge of view

			//check up
			if(tempCharPos[1] < ancherRef[1] + game.g_movementViewDif) { up = true; }
			//check down
			if(tempCharPos[1] >= ancherRef[1] + game.g_yGameviewSize - game.g_movementViewDif) { down = true }
			//check left
			if(tempCharPos[0] < ancherRef[0] + game.g_movementViewDif) { left = true }
			//check right
			if(tempCharPos[0] >= ancherRef[0] + game.g_yGameviewSize - game.g_movementViewDif) { right = true }
			
			function ViewWithinBounds()
			{	
				if(
					//left side within
					tempAnchor[0] >= 0 &&
					//top side within
					tempAnchor[1] >= 0 &&

					//bottom side within
					(tempAnchor[0] + game.g_xGameviewSize) < game.g_xAxisTiles &&
					//right side within
					(tempAnchor[1] + game.g_yGameviewSize) < game.g_yAxisTiles)
				{
					return true;
				}
				else
				{
					return false;
				}
			}
			
			switch(direction)
			{
				case "up":
					if (up == true) { tempAnchor[1]--; }
					break;
				case "down":
					if (down == true) { tempAnchor[1]++; }
					break;
				case "left":
					if (left == true) { tempAnchor[0]--; }
					break;
				case "right":
					if (right == true) { tempAnchor[0]++; }
					break;
				default:
					console.log("'" + direction + "'" + " isn't a valid parameter");
					break;
			}
			

			if(ViewWithinBounds())
			{
				game.gameGrid.gameViewAnchor = game.gameGrid.CalcArrayPos(tempAnchor[0], tempAnchor[1]);
			}
		},
		
		CalcViewAnchor : function ()
		{	
			
			//intend to make maincharacter appear in center of view on start
			//only used at start
			var centerPos = game.entity.g_MainCharacter.position;
			var ancherPos = [];

			if (game.gameGrid.CalcArrayPos(centerPos[0] - Math.floor(game.g_yGameviewSize/2), centerPos[1] - Math.floor(game.g_xGameviewSize/2)) < 01)
			{
				console.log("MainCharacter too close to upper left corner, drawing from 0,0");
				ancherPos[0] = 0;//Math.floor(game.g_xGameviewSize/2) - centerPos[0];
				ancherPos[1] = 0;//Math.floor(game.g_yGameviewSize/2) - centerPos[1];

				//console.log(ancherPos[0] + "," + ancherPos[1]);
				game.gameGrid.gameViewAnchor = game.gameGrid.CalcArrayPos(ancherPos[0],ancherPos[1]);
			}
			else
			{
				console.log("Drawing with maincharacter as center");
				game.gameGrid.gameViewAnchor = game.gameGrid.CalcArrayPos(centerPos[0] - Math.floor(game.g_yGameviewSize/2), centerPos[1] - Math.floor(game.g_xGameviewSize/2));
			}
		},

		CalcTiles : function ()
		{
			this.tileHeight = game.g_canvasHeight/game.g_yGameviewSize;
			this.tileWidth = game.g_canvasWidth/game.g_xGameviewSize;
		},

		BuildTiles : function ()
		{
			var seen = false;
			var xRow = 0;
			var yRow = 0;
			for (var i = 0; i < game.g_xAxisTiles * game.g_yAxisTiles; i++)
			{
				//add tile coordinate to tile. 
				//[2] represents a reference to an object if 
				//something is to be drawn on tile

				var tile = new game.entity.Tile();
				//[x, y, background,background object, moving object, foreground object]
				game.gameGrid.grid.push([xRow,yRow,null,tile,null, null]);

				if (xRow < game.g_xAxisTiles-1)//-1 magically makes it fit within the bounds (something 0 base.blahblah)
				{ 
					//add to xrow
					xRow++;
				} 
				else 
				{
					//add to yrow and reset xrow, if xrow is full
					yRow++;
					xRow=0;
				}
			}
		},

		DrawTiles : function () 
		{	
			var drawStartBlock = game.gameGrid.gameViewAnchor;
			
			//var layersToDraw = [3,2];

			//[x, y, background,background object, moving object, foreground object]
			DrawView(2); //draw background

			DrawView(3); //draw background objects

			DrawView(4); //draw moving objects

			DrawView(5); //draw foreground objects

			function DrawView(layer, callback)
			{
				//console.log(game.gameGrid.grid[game.gameGrid.CalcArrayPos(5,5)]);
				//console.log(layer);
				var xCounter = 0;
				for(var i = 0; i < (game.g_xGameviewSize * game.g_yGameviewSize); i++)
				{
					var gridBlockRef = game.gameGrid.grid[drawStartBlock + xCounter];
					//if grid is outside of the coordinate grid draw black cells in those positions

					if (gridBlockRef == undefined)
					{
						//if outside of grid
					}
					else if(gridBlockRef[layer] != null)
					{   
						DrawTile(i, gridBlockRef, layer);
					}
					if (xCounter == game.g_xGameviewSize - 1)
					{
						xCounter = 0;
						drawStartBlock += game.g_xAxisTiles; //add the viewsize to the start point to get to the same x-coord block 1 y-pos further "up" (e.g. x,y+1)
					}
					else
					{
						xCounter++;
					}	
				}
				//reset startblock after drawing
				drawStartBlock = game.gameGrid.gameViewAnchor;
			}

			function DrawTile(iterator, blockRef, layer) 
			{
				//takes an iterator to calculate where the block should be drawn on view
				//blockRef to access informaton about the block
				//layer to know what layer to draw it on ([3] is background [4] is foreground containing moving entities)

				var x = (iterator % game.g_xGameviewSize) * game.gameGrid.tileWidth;
				var y = Math.floor(iterator / game.g_xGameviewSize) * game.gameGrid.tileHeight;
				var width = game.gameGrid.tileWidth;
				var height = game.gameGrid.tileHeight;

				if(!blockRef[layer].hasSprite)
				{	
					game.g_ctx.fillStyle = blockRef[layer].color;
					game.g_ctx.fillRect(x, y, width, height);
				}
				else
				{
					var anim = blockRef[layer].spriteArr[blockRef[layer].currentAnim];
					var currFrame = anim[blockRef[layer].spriteChanges % anim.length];

					var img = blockRef[layer].sprite;
					var sx = currFrame[2][0]; //x-cord start clip
					var sy = currFrame[2][1]; //y-cord start clip
					var swidth = currFrame[0][1]; //gridBlockRef[2].spriteArr[0][1]; //width of clipped image
					var sheight = currFrame[1][1]; //height of clipped image
					//draw image
					var tempX = x + blockRef[layer].xMoving;
					var tempY = y + blockRef[layer].yMoving;
					game.g_ctx.drawImage(img, sx, sy, swidth, sheight, tempX, tempY, width, height);

					//update animation
					//go to next animation, else reset if animations are at their end
					//if it's too long since last animation frame, use next frame
					if((new Date() - blockRef[layer].animationLastChanged) > blockRef[layer].animationTimer)
					{
						blockRef[layer].spriteChanges++;
						blockRef[layer].animationLastChanged = new Date();
					}
				}
			}			
		},

		//checks if an object is free for an entity to move to
		UnitCollision : function(entity, direction)
		{
			var gridFree = false;
			var moveView = false;

			var tempEntityX = entity.position[0];
			var tempEntityY = entity.position[1];

			function IsGridFree()
			{	
				var ancherRef = game.gameGrid.grid[game.gameGrid.gameViewAnchor];
				//console.log(game.gameGrid.grid[game.gameGrid.gameViewAnchor]);
				if(
					//if the coordinate position is within the grid array
					game.gameGrid.CalcArrayPos(tempEntityX, tempEntityY) >= 0 &&
					game.gameGrid.CalcArrayPos(tempEntityX, tempEntityY) <= game.gameGrid.grid.length &&

					/*
					//if the coordinate is within the bounds of the coordinate system
					tempEntityX < game.g_xAxisTiles && tempEntityX >= 0 &&
					tempEntityY < game.g_yAxisTiles && tempEntityY >= 0 &&
					*/

					//if the coordinate is within the bounds of the view grid
					tempEntityX < ancherRef[0] + game.g_xGameviewSize && tempEntityX >= ancherRef[0] &&
					tempEntityY < ancherRef[1] + game.g_yGameviewSize && tempEntityY >= ancherRef[1] &&

					//if the spot is free and not already occupied
					game.gameGrid.grid[game.gameGrid.CalcArrayPos(tempEntityX, tempEntityY)][4] == null &&
					game.gameGrid.grid[game.gameGrid.CalcArrayPos(tempEntityX, tempEntityY)][3].solid == false)
				{
					return true;
				}
				else
				{
					return false;
				}
			}

			switch(direction)
			{
				case "up":
					tempEntityY--;
					break;

				case "down":
					tempEntityY++;
					break;

				case "left":
					tempEntityX--;
					break;

				case "right":
					tempEntityX++
					break;

				default:
					console.log("'" + direction + "'" + " isn't a valid parameter")
					break;
			}
			return IsGridFree();
		},

		CalcArrayPos : function(x,y)
		{
			//((width * (y + 1)) - 1) - ((width - x) - 1) 
			//takes a position and calculates its position in the base array that holds the gamegrid
			//addition and substraction of 1 is to make it work with 0-based indexing, since this grid is actually (example ->) 0-9 and not 1-10.
			var gridArrayNum = null;

			gridArrayNum = ((game.g_xAxisTiles * (y + 1)) - 1) - ((game.g_xAxisTiles - x) - 1);

			if (gridArrayNum != null)
			{
				return gridArrayNum;
			}
			else
			{
				console.log("Error in Calcpos()");
			}	
		}	
	},

	StartGameloop : function ()
	{
		setInterval(this.Gameloop, game.g_loopDelay) //33 milli sec ~ 30 fps
	},

	Gameloop : function ()
	{
		if (game.g_gameLoopRunning)
		{
			game.g_ctx.clearRect(0, 0, game.g_canvasWidth, game.g_canvasHeight);
			game.gameGrid.DrawTiles();
		}
		else
		{
			//do nothing, but keep instance running
		}
	},


	//Do stuff before the game loop starts
	PreStartSetup : function ()
	{
		//calc tiles needed to be done first
		game.gameGrid.CalcTiles();
		//create player controlled character
		//to assert player start at center of screen -> 
		game.entity.g_MainCharacter = new game.entity.maincharacter.MainCharacter();
		game.entity.g_MainCharacter.name = "Our Hero";
		game.entity.g_MainCharacter.position = [0,0];
		

		game.gameGrid.GameGridSetup();
		game.StartGameloop();

		game.gameGrid.DrawTiles();



		/*
		* maincharacter is created early for reference reasons
		* grid positions and remaining entities are created later when the grid is created
		*/
		game.entity.g_MainCharacter.Create(5,5);
		//put entities
		var block3 = new game.entity.Entity();
		block3.name = "A Boulder";
		block3.Create(4,4);
		var block4 = new game.entity.Entity();
		block4.name = "A Boulder";
		block4.Create(6,6);
		
		var grass1 = new game.entity.grasstile.GrassTile();
		grass1.name = "GrassTile";
		grass1.Create(1,1);
		var grass2 = new game.entity.grasstile.GrassTile();
		grass2.name = "GrassTile";
		grass2.Create(2,2);
		var grass3 = new game.entity.grasstile.GrassTile();
		grass3.name = "GrassTile";
		grass3.Create(1,2);
		var grass4 = new game.entity.grasstile.GrassTile();
		grass4.name = "GrassTile";
		grass4.Create(2,1);
		

		//console.log(game.gameGrid.grid[game.gameGrid.CalcArrayPos(5,5)][3]);
		//console.log(game.gameGrid.CalcArrayPos(5,5));

		//console.log(game.gameGrid.grid);
	},

	//start gameloop
	Start : function ()
	{
		game.g_gameLoopRunning = true;
		console.log("Gameloop started");
	},
	//pause gameloop
	Stop : function ()
	{
		game.g_gameLoopRunning = false;
		console.log("Gameloop stopped");
	}
};

