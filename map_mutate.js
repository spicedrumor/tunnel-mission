var tmiss_mapMutate = {

explosion: function(ballX, ballY, mapObject, playerAlive, validTile, newMessage)
{
    var output;
    var map;
    var value;

    map = mapObject.mapArray;

    if (!playerAlive)
    {
        return;
    }

    output = 12;

    newMessage("Giant explosion!"); 
    tmiss_sound.explode();
    map[ballY][ballX] = 0;
    if (validTile(ballX, ballY - 1))
    {
        value = map[ballY - 1][ballX];
        if (value > 2 && value < 9)
        {
            mapObject.removeMob(ballX, ballY - 1);
        }
        map[ballY - 1][ballX] = output;
        if (validTile(ballX, ballY - 2))
        {
            value = map[ballY - 2][ballX];
            if (value > 2 && value < 9)
            {
                mapObject.removeMob(ballX, ballY - 2);
            }
            map[ballY - 2][ballX] = output;
            if (validTile(ballX, ballY - 3))
            {
                value = map[ballY - 3][ballX];
                if (value > 2 && value < 9)
                {
                    mapObject.removeMob(ballX, ballY - 3);
                }
                map[ballY - 3][ballX] = output;
            }
        }
    }

    if (validTile(ballX + 1, ballY))
    {
        value = map[ballY][ballX + 1];
        if (value > 2 && value < 9)
        {
            mapObject.removeMob(ballX + 1, ballY);
        }
        map[ballY][ballX + 1] = output;
        if (validTile(ballX + 2, ballY))
        {
            value = map[ballY][ballX + 2];
            if (value > 2 && value < 9)
            {
                mapObject.removeMob(ballX + 2, ballY);
            }
            map[ballY][ballX + 2] = output;
            if (validTile(ballX + 3, ballY))
            {
                value = map[ballY][ballX + 3];
                if (value > 2 && value < 9)
                {
                    mapObject.removeMob(ballX + 3, ballY);
                }
                map[ballY][ballX + 3] = output;
            }
        }
    }

    if (validTile(ballX, ballY + 1))
    {
        value = map[ballY + 1][ballX];
        if (value > 2 && value < 9)
        {
            mapObject.removeMob(ballX, ballY + 1);
        }
        map[ballY + 1][ballX] = output;
        if (validTile(ballX, ballY + 2))
        {
            value = map[ballY + 2][ballX];
            if (value > 2 && value < 9)
            {
                mapObject.removeMob(ballX, ballY + 2);
            }
            map[ballY + 2][ballX] = output;
            if (validTile(ballX, ballY + 3))
            {
                value = map[ballY + 3][ballX];
                if (value > 2 && value < 9)
                {
                    mapObject.removeMob(ballX, ballY + 3);
                }
                map[ballY + 3][ballX] = output;
            }
        }
    }

    if (validTile(ballX - 1, ballY))
    {
        value = map[ballY][ballX - 1];
        if (value > 2 && value < 9)
        {
            mapObject.removeMob(ballX - 1, ballY);
        }
        map[ballY][ballX - 1] = output;
        if (validTile(ballX - 2, ballY))
        {
            value = map[ballY][ballX - 2];
            if (value > 2 && value < 9)
            {
                mapObject.removeMob(ballX - 2, ballY);
            }
            map[ballY][ballX - 2] = output;
            if (validTile(ballX - 3, ballY))
            {
                value = map[ballY][ballX - 3];
                if (value > 2 && value < 9)
                {
                    mapObject.removeMob(ballX - 3, ballY);
                }
                map[ballY][ballX - 3] = output;
            }
        }
    }
}

}
