var tmiss_mapMutate = {

newMessage: null,
playerObject: null,
explosion: function(ballX, ballY, mapObject, playerObject, playerAlive, validTile, newMessage)
{
    var map;
    var value;

    map = mapObject.mapArray;

    this.newMessage = newMessage;
    this.playerObject = playerObject;

    if (playerAlive)
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
