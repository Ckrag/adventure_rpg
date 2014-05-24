game.animation = 
{
	Move : function (entity, targetBlock, direction)
	{
		console.log("Pre: " + entity.position[0] + "," + entity.position[1]);
		console.log("Post: " + game.gameGrid.grid[targetBlock][0] + "," + game.gameGrid.grid[targetBlock][1]);

		entity.currentlyMoving = true;
		var startPos = entity.position;
		var targetPos = [game.gameGrid.grid[targetBlock][0], game.gameGrid.grid[targetBlock][1]];

		//calculate grid numbers from coordinates
		var newGridNumber = game.gameGrid.CalcArrayPos(targetPos[0], targetPos[1]);
		var oldGridNumber = game.gameGrid.CalcArrayPos(startPos[0], startPos[1]);

		//lock targetblock so other entities can't move to it
		// FIX LOCK -> //game.gameGrid.grid[newGridNumber][2] = "locked";
		//console.log(game.gameGrid.grid[game.gameGrid.CalcArrayPos(targetPos[0], targetPos[1])][2]);
		
		MoveStep();
		var timerHandle = setInterval(MoveStep, 100);
		function MoveStep()
		{	
			switch(direction)
			{
				case "up":
					entity.currentAnim = 3;
					//check if it has moved far enough
					if((startPos[1]*game.gameGrid.tileHeight+entity.yMoving) > (targetPos[1]*game.gameGrid.tileHeight))
					{
						entity.yMoving -= entity.movementSpeed * game.gameGrid.tileHeight;
					}
					else
					{
						ExitAnimation();
					}
					break;

				case "down":
					entity.currentAnim = 4;
					//check if it has moved far enough
					if((startPos[1]*game.gameGrid.tileHeight+entity.yMoving) < (targetPos[1]*game.gameGrid.tileHeight))
					{
						entity.yMoving += entity.movementSpeed * game.gameGrid.tileHeight;
					}
					else
					{
						ExitAnimation();
					}
					break;

				case "left":
					entity.currentAnim = 2;
					//check if it has moved far enough
					if((startPos[0]*game.gameGrid.tileWidth+entity.xMoving) > (targetPos[0]*game.gameGrid.tileWidth))
					{
						entity.xMoving -= entity.movementSpeed * game.gameGrid.tileWidth;
					}
					else
					{
						ExitAnimation();
					}
					break;					

				case "right":
					entity.currentAnim = 1;
					//check if it has moved far enough
					if((startPos[0]*game.gameGrid.tileWidth+entity.xMoving) < (targetPos[0]*game.gameGrid.tileWidth))
					{
						entity.xMoving += entity.movementSpeed * game.gameGrid.tileWidth;
					}
					else
					{
						ExitAnimation();
					}
					break;
				default:
					console.log("error occured in MoveStep()");
			}

			function ExitAnimation()
			{
				entity.StandIdle();
				// -> stop setinterval
				clearTimeout(timerHandle);
				timerHandle = null;

				// -> copy object to new position
				game.gameGrid.grid[newGridNumber][4] = entity;

				// -> remove original one from it's previous position
				game.gameGrid.grid[oldGridNumber][4] = null;

				//make object availible for new movement
				entity.currentlyMoving = false;

				//reset the x/yMoving propperty of the object
				entity.xMoving = 0;
				entity.yMoving = 0;

				entity.position[0] = targetPos[0];
				entity.position[1] = targetPos[1];

				// -> change grid position of object from old to new one
				// -> lock the position it's moving to
			}


		}
	}
}