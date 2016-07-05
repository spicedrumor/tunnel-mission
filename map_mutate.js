var tmiss_mapMutate = {

newMessage: null,
playerObject: null,
mapObject: null,
validTile: null,
slain: 0,
output: -1,
fire: function(tileX, tileY, mapObject){
    var random;

    random = Math.floor(Math.random() * 5);

    if (random === 0)
    {
        mapObject.mapArray[tileY][tileX] = 0;
        delete mapObject.fireAlert[tileY][tileX];
    }
    else
    {
        this.neighbourLicker(tileX, tileY, mapObject);
        mapObject.fireAlert[tileY][tileX] = setTimeout(function(){tmiss_mapMutate.fire(tileX, tileY, mapObject)}, 1000);
    }
},
neighbourLicker: function(tileX, tileY, mapObject){
    var i;
    var j;
    var x;
    var y;
    var array;
    var map;

    map = mapObject.mapArray;
    array = mapObject.boomAlert;

    mapWidth = mapObject.mapArray[0].length;
    mapHeight = mapObject.mapArray.length;

    for (i = -1; i < 2; i++)
    {
        for (j = -1; j < 2; j++)
        {
            if (i != 0 || j != 0)
            {
                x = tileX + j;
                y = tileY + i;
                if (x >= 0 && y >= 0 && x < mapWidth && y < mapHeight)
                {
                    if (map[y][x] === 14 || map[y][x] === 15)
                    {
                        this.explosion(x, y, mapObject, this.playerObject, this.validTile, this.newMessage, true);
                    }
                }
            }
        }
    }
},
explosion: function(tileX, tileY, mapObject, playerObject, validTile, newMessage, rootCall){
    var map;
    var value;
    var array;

    if (mapObject.boomAlert[tileY])
    {
        clearTimeout(mapObject.boomAlert[tileY][tileX]);
        delete mapObject.boomAlert[tileY][tileX];
    }

    map = mapObject.mapArray;

    this.newMessage = newMessage;
    this.playerObject = playerObject;
    this.mapObject = mapObject;
    this.validTile = tmiss_validate.validTile;

    if (playerObject.alive)
    {
        newMessage("Giant explosion!"); 
        tmiss_sound.explode();

        array = mapObject.fireAlert;
        if (array[tileY] === undefined)
        {
            array[tileY] = [];
        }
        array[tileY][tileX] = setTimeout(function(){tmiss_mapMutate.fire(tileX, tileY, mapObject)}, 1000);
        map[tileY][tileX] = this.output;

        this.recursion(tileX, tileY, 0, -1, mapObject, validTile, 8);
        this.recursion(tileX, tileY, 0, 1, mapObject, validTile, 8);
        this.recursion(tileX, tileY, -1, 0, mapObject, validTile, 8);
        this.recursion(tileX, tileY, 1, 0, mapObject, validTile, 8);

        if (rootCall)
        {
            playerObject.score += (this.slain * this.slain * 777);
            this.slain = 0;
        }
    }
},

recursion: function(tileX, tileY, xOffset, yOffset, mapObject, validTile, count)
{
    var map;
    var sevener;
    var array;
    var random;

    sevener = false;

    map = mapObject.mapArray;

    if (count > 0)
    {
        tileX += xOffset;
        tileY += yOffset;
        if (validTile(tileX, tileY, mapObject))
        {
            value = map[tileY][tileX];
            if (value > 2 && value < 10)
            {
                mapObject.removeMob(tileX, tileY);
                if (value === 7)
                {
                    random = Math.floor(Math.random() * 2);

                    if (this.slain === 0)
                    {
                        this.newMessage("A 7 has fallen!");
                    }
                    else if (this.slain == 1)
                    {
                        this.newMessage("Multi-Kill!");
                    }
                    else if (this.slain == 2)
                    {
                        this.newMessage("Mega-Kill!");
                    }
                    else if (this.slain > 2)
                    {
                        this.newMessage("M-M-M-MONSTER KILL!!!");
                    }
                    if (random === 0)
                    {
                        mapObject.insertMob(tileX, tileY, 9);
                    }
                    else
                    {
                        map[tileY][tileX] = 18;
                    }
                    sevener = true;
                    this.slain += 1;
                }
            }
            else if (value === 14 || value === 15)
            {
                this.explosion(tileX, tileY, this.mapObject, this.playerObject, validTile, this.newMessage, false);
            }
            if (sevener)
            {
                count = 0;
            }
            else
            {
                array = mapObject.fireAlert;
                if (array[tileY] === undefined)
                {
                    array[tileY] = [];
                }
                clearTimeout(array[tileY][tileX]);
                array[tileY][tileX] = setTimeout(function(){tmiss_mapMutate.fire(tileX, tileY, mapObject)}, 1000);
                map[tileY][tileX] = this.output;
            }
        }

        count -= 1;
        this.recursion(tileX, tileY, xOffset, yOffset, mapObject, validTile, count);
    }
}

}
