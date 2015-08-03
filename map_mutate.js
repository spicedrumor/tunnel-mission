var tmiss_mapMutate = {

newMessage: null,
playerObject: null,
mapObject: null,
slain: 0,
output: -1,
fire: function(tileX, tileY, mapObject){
    var random;

    random = Math.floor(Math.random() * 7);

    if (random === 0)
    {
        mapObject.mapArray[tileY][tileX] = 0;
        delete mapObject.fireAlert[tileY][tileX];
    }
    else
    {
        mapObject.fireAlert[tileY][tileX] = setTimeout(function(){tmiss_mapMutate.fire(tileX, tileY, mapObject)}, 1000);
    }
},
explosion: function(tileX, tileY, mapObject, playerObject, validTile, newMessage, rootCall)
{
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

        this.recursion(tileX, tileY, 0, -1, mapObject, validTile, 3);
        this.recursion(tileX, tileY, 0, 1, mapObject, validTile, 3);
        this.recursion(tileX, tileY, -1, 0, mapObject, validTile, 3);
        this.recursion(tileX, tileY, 1, 0, mapObject, validTile, 3);

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

    sevener = false;

    map = mapObject.mapArray;

    if (count > 0)
    {
        tileX += xOffset;
        tileY += yOffset;
        if (validTile(tileX, tileY))
        {
            value = map[tileY][tileX];
            if (value > 2 && value < 10)
            {
                mapObject.removeMob(tileX, tileY);
                if (value === 7)
                {
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
                    mapObject.insertMob(tileX, tileY, 9);
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
                array[tileY][tileX] = setTimeout(function(){tmiss_mapMutate.fire(tileX, tileY, mapObject)}, 1000);
                map[tileY][tileX] = this.output;
            }
        }

        count -= 1;
        this.recursion(tileX, tileY, xOffset, yOffset, mapObject, validTile, count);
    }
}

}
