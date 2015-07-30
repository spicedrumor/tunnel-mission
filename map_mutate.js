var tmiss_mapMutate = {

newMessage: null,
playerObject: null,
mapObject: null,
explosion: function(ballX, ballY, mapObject, playerObject, validTile, newMessage)
{
    var map;
    var value;

    if (mapObject.boomAlert[ballY])
    {
        clearTimeout(mapObject.boomAlert[ballY][ballX]);
        delete mapObject.boomAlert[ballY][ballX];
    }

    map = mapObject.mapArray;

    this.newMessage = newMessage;
    this.playerObject = playerObject;
    this.mapObject = mapObject;

    if (playerObject.alive)
    {
        newMessage("Giant explosion!"); 
        tmiss_sound.explode();
        map[ballY][ballX] = 0;

        this.recursion(ballX, ballY, 0, -1, mapObject, validTile, 3);
        this.recursion(ballX, ballY, 0, 1, mapObject, validTile, 3);
        this.recursion(ballX, ballY, -1, 0, mapObject, validTile, 3);
        this.recursion(ballX, ballY, 1, 0, mapObject, validTile, 3);
    }
},

recursion: function(tileX, tileY, xOffset, yOffset, mapObject, validTile, count)
{
    var map;
    var sevener;

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
                    this.newMessage("A 7 has fallen!");
                    mapObject.insertMob(tileX, tileY, 9);
                    playerObject.score += 777;
                    sevener = true;
                }
            }
            else if (value === 14 || value === 15)
            {
                this.explosion(tileX, tileY, this.mapObject, this.playerObject, validTile, this.newMessage);
            }
            if (sevener)
            {
                count = 0;
            }
            else
            {
                map[tileY][tileX] = 12;
            }
        }

        count -= 1;
        this.recursion(tileX, tileY, xOffset, yOffset, mapObject, validTile, count);
    }
}

}
