(function TMGame ()
{
    var KEY_CODE_W = 87;
    var KEY_CODE_A = 65;
    var KEY_CODE_S = 83;
    var KEY_CODE_D = 68;
    var MAP_VAL_EMPTY = 0;
    var MAP_VAL_PLAYER = 1;
    var MAP_VAL_MOB = 3;
    var map;
    var mapString;
    var xPos;
    var yPos;
    var directions;

    directions = ["n", "s", "e", "w"];

    xPos = 0;
    yPos = 0;

    map = [
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0],
        [0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,3,0,0,0,0,0,3,4,4,4,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,3,0,0,9,3,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0],
        [0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,3,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,3,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,3,0,0,0,0,6,0,0,0,0,0,0,0,0,0,7,0,0],
        [0,0,0,6,0,0,3,0,5,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0],
        [0,0,0,0,0,0,3,0,0,0,0,0,5,0,0,0,0,0,0,0,0,6,0,0],
        [0,0,0,0,0,0,3,0,0,0,0,9,0,0,0,0,0,0,0,9,0,0,0,2],
        [0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,9,9,0,0,9,9],
        [0,0,0,0,0,0,3,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,9,9],
    ];
    /*
    map = [
        [1, 0, 0, 0],
        [3, 0, 0, 0],
        [3, 0, 0, 0],
        [3, 0, 0, 0],
    ];
    */
    function validTile(newX, newY)
    {
        var result;
        var mapWidth;
        var mapHeight;
        var notTooSmall;
        var notTooBig;

        result = false;
        mapWidth = map[0].length;
        mapHeight = map.length;

        if (newX >= 0 && newY >= 0)
        {
                notTooSmall = true;
        }
        if (newX < mapWidth && newY < mapHeight)
        {
            notTooBig = true;
        }

        if (notTooSmall && notTooBig)
        {
            result = true;
        }

        return result;
    }

    function validMove(newX, newY)
    {
        var result;

        result = false;
        if (validTile(newX, newY))
        {
            if (map[newY][newX] == 0)
            {
                result = true;
            }
        }

        return result;
    }

    function moveRandomMob()
    {
        var randomX;
        var randomY;
        var randomDirection;
        var destination;

        randomX = Math.floor(Math.random() * map[0].length);
        randomY = Math.floor(Math.random() * map.length);
        
        randomDirection = directions[Math.floor(Math.random() * 4)];
        
        destination = map[randomY][randomX];
        if (destination > 2) 
        {
            move(randomDirection, randomX, randomY, destination);
        }

        setTimeout(moveRandomMob, 5);
    }

    function move(direction, originX, originY, value)
    {
        var result;
        var offsetX;
        var offsetY;
        var newX;
        var newY;
        
        result = [];
        result[0] = originX;
        result[1] = originY;

        offsetX = 0;
        offsetY = 0;

        if (direction === "n")
        {
            offsetY = -1;
        }
        else if (direction === "e")
        {
            offsetX = 1;
        }
        else if (direction === "s")
        {
            offsetY = 1;
        }
        else if (direction === "w")
        {
            offsetX = -1;
        }

        newX = originX + offsetX;
        newY = originY + offsetY;

        if (validMove(newX, newY))
        {
            map[originY][originX] = 0;
            map[newY][newX] = value;
            result[0] = newX;
            result[1] = newY;
        }
        else
        {
        }

        return result;
    }

    document.onkeyup = function(e)
    {
        var direction;
        var newCoords;
        var key = e.keyCode ? e.keyCode : e.which;
                    
        direction = "";
        if (key == KEY_CODE_W)
        {
            direction = "n";
        }
        else if (key == KEY_CODE_D)
        {
            direction = "e";
        }
        else if (key == KEY_CODE_S)
        {
            direction = "s";
        }
        else if (key == KEY_CODE_A)
        {
            direction = "w";
        }

        if (direction === "")
        {
        }
        else
        {
                newCoords = move(direction, xPos, yPos, MAP_VAL_PLAYER);
            xPos = newCoords[0];
            yPos = newCoords[1];
        }
    }

    function mapToString(map)
    {
        var i;
        var j;
        var result;

        result = "<h1><code>";
        for (i = 0; i < map.length; i++)
        {
            for (j = 0; j < map[0].length; j++)
            {
                if (map[i][j] == 1)
            {
                result += "@";
            }
            else if (map[i][j] == 0)
            {
                result += ".";
            }
            else
            {
                result += map[i][j];
            }
            }
            result += "<br>";
        }

        result += "</code></h1><br>";
        return result;
    }
    
    function drawMap()
    {
        mapString = mapToString(map);
        document.body.innerHTML = mapString;
        setTimeout(drawMap, 50);
    }

    function playerInteractions()
    {
        var i;
        var j;
        for (i = -1; i < 2; i++)
        {
            for (j = -1; j < 2; j++)
            {
                if (validTile(xPos + j, yPos + i))
            {
                playerInteract(map[yPos + i][xPos + j]);
            }
            }
        }

        setTimeout(playerInteractions, 250);
    }

    function playerInteract(value)
    {
        var random;

        if (value == 2)
        {
            document.write("You win!");
        }
        if (value == 3)
        {
            random = Math.floor(Math.random() * 3);
            if (random == 0)
            {
                map[0][0] = 7;
            }
            else if (random == 1)
            {
                map[0][map[0].length - 1] = 7;
            }
            else if (random == 2)
            {
                map[map.length - 1][0] = 7;
            }
        }
        if (value == 4)
        {
            map[0][0] = 5;
            map[0][map[0].length - 1] = 5;
        }
        if (value == 5)
        {
            map[0][0] = 6;
            map[0][map[0].length - 1] = 6;
            map[map.length - 1][0] = 6;
            map[map.length - 1][map[0].length - 1] = 6;
        }
        if (value == 6)
        {
            random = randomTile();
            map[random[1]][random[0]] = 7;
        }
        if (value == 7)
        {
            document.write("Game over: 7 8 u.");
        }
    }

    function randomTile()
    {
        var randomX;
        var randomY;
        var result;

        result = [];
        randomX = Math.floor(Math.random() * map[0].length);
        randomY = Math.floor(Math.random() * map.length);
        result[0] = randomX;
        result[1] = randomY;

        return result;
    }

    Blast = function(direction)
    {
        this.direction = direction;
    }

    setTimeout(moveRandomMob, 25);
    setTimeout(drawMap, 25);
    setTimeout(playerInteractions, 25);
    mapString = mapToString(map);
    document.body.innerHTML += mapString;
}());
