game.entity.grasstile = 
{
	//*******
	//Grass
	//*******
	GrassTile : function()
	{
		game.entity.Entity.call(this);
		this.hasSprite = true;
		this.sprite = game.sprite.g_spriteList[1][2];
		this.currentAnim = 0;
		this.spriteArr = [
			[ //grass pos 1
				[ //frame 1
					["width", 100], //width
					["height", 100], //height
					[0,0] //sprite cut coordinate (x,y)
				]
			],
		];
		this.color = "#000";
		this.movable = false;
		this.solid = false;
	}
}

//*******
//Grass prototype
//*******
//inherit
game.entity.grasstile.GrassTile.prototype = new game.entity.Entity();
game.entity.grasstile.GrassTile.prototype.Contructor = game.entity.grasstile.GrassTile;
game.entity.grasstile.GrassTile.prototype.Create = function(x,y)
{
	console.log(this.name + " was created");
	if(x != null && y != null)
	{
		this.position = [x,y];
	}
	game.gameGrid.grid[game.gameGrid.CalcArrayPos(x,y)][3] = this;
}