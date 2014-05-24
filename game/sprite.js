game.sprite =
{
	g_basePath : "sprites/",
	g_spriteCache : [],

	//"register" all sprites here for preloading. entity classes refer to their sprite image here.
	g_spriteList : [
		["MainCharacter", "jake_shine/jake_shine.png", null],
		["GrassBlock", "grass1.png", null]
	],
	
	PreloadSprites : function ()
	{
		var loaded = 0;
		for(var i = 0; i < game.sprite.g_spriteList.length; i++)
		{
			var sprite = new Image();
			
			game.sprite.g_spriteList[i][2] = sprite;
			sprite.onload = function ()
			{			
				loaded++;
				if (loaded ==  game.sprite.g_spriteList.length)
				{
					game.InitiateGame();
					game.sprite.g_spritesReady = true;
				}
			}

			sprite.src = game.sprite.g_basePath + game.sprite.g_spriteList[i][1];
			
		} 
	}
}