game.entity.maincharacter =
{
	//*******
	//Player
	//*******
	MainCharacter : function()
	{	
		game.entity.Entity.call(this);
		this.hasSprite = true;
		this.sprite = game.sprite.g_spriteList[0][2];
		this.currentAnim = 0;
		this.animationTimer = 200;
		this.color = "#FF0000";
		this.movable = true;
		this.solid = true;
		this.movementSpeed = 0.15;
		this.spriteArr = [
			[ //standing still, looking around
				[ //frame 1
					["width", 31], //width
					["height", 48], //height
					[212,27] //sprite cut coordinate (x,y)
				]
			],
			
			[ //moving right
				[ //frame 1
					["width", 27],
					["height", 48],
					[216,136]
				],
				[ //frame 2
					["width", 26],
					["height", 47],
					[250,137]
				],
				[ //frame 3
					["width", 27],
					["height", 48],
					[280,136]
				],
				[ //frame 4
					["width", 28],
					["height", 47],
					[312,137]
				]
			],

			[ //moving left
				[ //frame 1
					["width", 25],
					["height", 48],
					[216,82]
				],
				[ //frame 2
					["width", 25],
					["height", 47],
					[247,83]
				],
				[ //frame 3
					["width", 25],
					["height", 48],
					[280,82]
				],
				[ //frame 4
					["width", 27],
					["height", 47],
					[311,83]
				]
			],

			[ //moving up
				[ //frame 1
					["width", 31],
					["height", 48],
					[215,189]
				],
				[ //frame 2
					["width", 30],
					["height", 47],
					[248,190]
				],
				[ //frame 3
					["width", 31],
					["height", 48],
					[279,189]
				],
				[ //frame 4
					["width", 30],
					["height", 47],
					[311,190]
				]
			],

			[ //moving down
				[ //frame 1
					["width", 31],
					["height", 48],
					[212,27]
				],
				[ //frame 2
					["width", 30],
					["height", 47],
					[244,28]
				],
				[ //frame 3
					["width", 31],
					["height", 48],
					[276,27]
				],
				[ //frame 3
					["width", 30],
					["height", 47],
					[308,28]
				]
			],
			
		];
	},
}

//*******
//Player prototype
//*******
//inherit

game.entity.maincharacter.MainCharacter.prototype = new game.entity.Entity();
//correct construction pointer since it points to Mainentity
game.entity.maincharacter.MainCharacter.prototype.Contructor = game.entity.maincharacter.MainCharacter;
game.entity.maincharacter.MainCharacter.prototype.Destroy = function()
{
	//shouldn't be possible to destroy
}
game.entity.maincharacter.MainCharacter.prototype.Create = function(x,y)
{
	console.log(this.name + " was created");
	if(x != null && y != null)
	{
		this.position = [x,y];
	}
	game.gameGrid.grid[game.gameGrid.CalcArrayPos(x,y)][4] = this;
}