game.entity = 
{
	//pos [0] should always be the main character
	//g_entityList : [], --retired!
	//instantiate maincharacter here to keep it in scope of checkKey()
	g_MainCharacter : null,

	//*******
	//Entity(base)
	//*******
	//base entity object (trying to implement enheiritence 0_0)
	Entity : function()
	{
		this.locked = false;
		this.hasSprite = false;
		this.position = null; //null until assigned by .Create() of the object
		this.name = "notNamed";
		this.movable = false;
		this.solid = true;
		this.color = "#000000";

		//used when animating movement
		this.currentlyMoving = false;
		this.xMoving = 0;
		this.yMoving = 0;
		this.movementSpeed = 0.15; //amount of blocks it will move per 'update'

		//handling animation
		this.spriteChanges = 0;
		this.animationTimer = 1000;
		this.animationLastChanged = new Date();
	},

	//*******
	//Tile
	//*******
	//base entity object (trying to implement enheiritence 0_0)
	Tile : function()
	{
		this.hasSprite = false;
		this.name = "tile";
		this.movable = false;
		this.solid = false;
		this.color = "#FFFF00";
	},
}

//*******
//Entity (base) prototype
//*******
game.entity.Entity.prototype.UpdateSprite = function()
{
	var ancherRef = game.gameGrid.grid[game.gameGrid.gameViewAnchor];

	//if within, just change the damn image
	if(this.position[0] < ancherRef[0] + game.g_xGameviewSize && this.position[0] >= ancherRef[0] &&
	this.position[1] < ancherRef[1] + game.g_yGameviewSize && this.position[1] >= ancherRef[1])
	{
		//console.log(this.name);
	}

}

//direction takes: "up", "down", "left", "right"
game.entity.Entity.prototype.Move = function(direction)
{
	if(game.gameGrid.UnitCollision(this, direction) && !this.currentlyMoving)
	{
		switch(direction)
		{
			case "up":
				//console.log(this.name + " MOVED UP");
				//this.position[1]--;
				game.gameGrid.MoveView("up");

				var tempPos = this.position[1];
				var targetPos = game.gameGrid.CalcArrayPos(this.position[0],tempPos - 1);

				game.animation.Move(this, targetPos, direction); 
				break;
			case "down":
				//console.log(this.name + " MOVED DOWN");
				//this.position[1]++;
				game.gameGrid.MoveView("down"); 

				var tempPos = this.position[1];
				var targetPos = game.gameGrid.CalcArrayPos(this.position[0],tempPos + 1);

				game.animation.Move(this, targetPos, direction); 
				break;
			case "left":
				//console.log(this.name + " MOVED LEFT");
				//this.position[0]--;
				game.gameGrid.MoveView("left"); 

				var tempPos = this.position[0];
				var targetPos = game.gameGrid.CalcArrayPos(tempPos - 1, this.position[1]);

				game.animation.Move(this, targetPos, direction);
				break;
			case "right":
				//console.log(this.name + " MOVED RIGHT");
				//this.position[0]++;
				game.gameGrid.MoveView("right");

				var tempPos = this.position[0];
				var targetPos = game.gameGrid.CalcArrayPos(tempPos + 1, this.position[1]);

				game.animation.Move(this, targetPos, direction);
				break;
			default:
				console.log("'" + direction + "'" + " isn't a valid parameter")
				break;
		}
	}
	
}

game.entity.Entity.prototype.StandIdle = function()
{
	//sets the first frame of the current animation as the idle 
	this.spriteArr[0][0] = this.spriteArr[this.currentAnim][0];
	this.currentAnim = 0;
}

game.entity.Entity.prototype.Destroy = function()
{
	console.log(this.name + " was destroyed");
}

game.entity.Entity.prototype.Create = function(x,y)
{
	console.log(this.name + " was created");
	if(x != null && y != null)
	{
		this.position = [x,y];
	}
	//game.entity.g_entityList.push(this);
	game.gameGrid.grid[game.gameGrid.CalcArrayPos(x,y)][3] = this;
	
}

//*******
//Tile prototype
//*******
//inherit
game.entity.Tile.prototype = new game.entity.Entity();
game.entity.Tile.prototype.Contructor = game.entity.Tile;
game.entity.Tile.prototype.Create = function(x,y)
{
	console.log(this.name + " was created");
	if(x != null && y != null)
	{
		this.position = [x,y];
	}
	game.gameGrid.grid[game.gameGrid.CalcArrayPos(x,y)][3] = this;
}