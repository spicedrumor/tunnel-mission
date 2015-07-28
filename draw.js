var tmiss_draw = {
    viewString: function(mapObject, playerObject)
    {
        var COLOR_PINK = "#FF66FF";
        var VIEW_LENGTH_AND_WIDTH = 15;
        var vlaw = VIEW_LENGTH_AND_WIDTH;
        var i;
        var j;
        var result;
        var centre;
        var map;
        var playerX;
        var playerY;
        var xOffset;
        var yOffset;
        var mapWidth;
        var mapHeight;
        var viewX;
        var viewY;
        var value;

        mapWidth = mapObject.mapArray[0].length;
        mapHeight = mapObject.mapArray.length;

        playerX = playerObject.xPos;
        playerY = playerObject.yPos;
        map = mapObject.mapArray;

        centre = Math.floor(vlaw / 2);

        result = "";

        result = "<h1><code>";
        for (i = 0; i < vlaw; i++)
        {
            for (j = 0; j < vlaw; j++)
            {
                viewX = (j - centre) + playerX;
                viewY = (i - centre) + playerY;
                
                if (viewX >= 0 && viewY >= 0 && viewX < mapWidth && viewY < mapHeight)
                {
                    value = map[viewY][viewX];

                    result += '<font color="';
                    if (value == 0)
                    {
                        result += '#6B6B6B">.';
                    }
                    else if (value == 1)
                    {
                        if (playerObject.flashBit)
                        {
                            result += "white" + '">@';
                        }
                        else
                        {
                            result += playerObject.colour + '">@';
                        }
                    }
                    else if (value == 2)
                    {
                        result += COLOR_PINK;
                        result += '">!';
                    }
                    else if (value == 3)
                    {
                        result += '#000066">3';
                    }
                    else if (value == 4)
                    {
                        result += '#0066FF">4';
                    }
                    else if (value == 5)
                    {
                        result += '#66FF66">5';
                    }
                    else if (value == 6)
                    {
                        result += '#FFFF66">6';
                    }
                    else if (value == 7)
                    {
                        result += '#FF0066">7';
                    }
                    else if (value == 8)
                    {
                        result += '#0000CC">8';
                    }
                    else if (value == 9)
                    {
                        result += '#9900FF">9';
                    }
                    else if (value == 10)
                    {
                        result += '#CC33FF">';
                        result += '<img src="res/trans_mushroom.png" alt="mushroom" height="20" width="15">';
                    }
                    else if (value == 12)
                    {
                        result += 'grey">';
                        result += '#';
                    }
                    else if (value == 14)
                    {
                        result += 'red">';
                        result += 'o';
                    }
                    else if (value == 15)
                    {
                        result += 'red">';
                        result += 'o';
                    }
                    else if (value == 16)
                    {
                        result += '#002900">';
                        result += '*';
                    }
                    else
                    {
                        result += 'blue">';
                        result += value;
                    }
                    result += '</font>';
                    result += "  ";
                }
                else
                {
                    result += " ? ";
                }
            }
            result += "<br>";
        }

        result += "</code></h1><br>";
        return result;
    }
}
