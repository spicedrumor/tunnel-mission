var tmiss_draw = {
    createHTMLString: function(mapObject, playerObject)
    {
        var COLOR_PINK = "#FF66FF";
        var VIEW_LENGTH_AND_WIDTH = 15;
        var FLICKER_RATE = 20;
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
        var random;

        mapWidth = mapObject.width;
        mapHeight = mapObject.height;

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
                    if (value === -1)
                    {
                        random = Math.floor(Math.random() * 2);
                        if (random === 0)
                        {
                            result += 'red">~';
                        }
                        else
                        {
                            result += 'red">^';
                        }
                    }
                    else if (value === 0)
                    {
                        result += '#6B6B6B">.';
                    }
                    else if (value === 1)
                    {
                        if (playerObject.flashBit && playerObject.phasing)
                        {
                            result += "grey" + '">@';
                        }
                        else if (playerObject.flashBit)
                        {
                            result += "white" + '">@';
                        }
                        else
                        {
                            result += playerObject.colour + '">@';
                        }
                    }
                    else if (value === 2)
                    {
                        result += COLOR_PINK;
                        result += '">*';
                    }
                    else if (value === 3)
                    {
                        result += '#000066">3';
                    }
                    else if (value === 4)
                    {
                        result += '#0066FF">4';
                    }
                    else if (value === 5)
                    {
                        result += '#66FF66">5';
                    }
                    else if (value === 6)
                    {
                        result += '#FFFF66">6';
                    }
                    else if (value === 7)
                    {
                        result += '#FF0066">7';
                    }
                    else if (value === 8)
                    {
                        result += '#0000CC">8';
                    }
                    else if (value === 9)
                    {
                        result += '#9900FF">9';
                    }
                    else if (value === 10)
                    {
                        result += '#CC33FF">';
                        result += '<img src="res/trans_mushroom.png" alt="mushroom" height="20" width="15">';
                    }
                    else if (value === 12)
                    {
                        result += 'grey">';
                        result += '#';
                    }
                    else if (value === 14)
                    {
                        result += '#990000">';
                        result += 'o';
                    }
                    else if (value === 15)
                    {
                        result += '#FF0000">';
                        result += 'o';
                    }
                    else if (value === 16)
                    {
                        random = Math.floor(Math.random() * FLICKER_RATE);
                        if (random == 0)
                        {
                            result += '#FFFFFF">';
                        } else
                        {
                            result += '#006600">';
                        }
                        result += '*';
                    }
                    else if (value === 17)
                    {
                        random = Math.floor(Math.random() * FLICKER_RATE);
                        if (random == 0)
                        {
                            result += '#000000">';
                        } else
                        {
                            result += '#990000">';
                        }
                        result += '*';
                    }
                    else if (value === 18)
                    {
                        result += '#CC33FF">';
                        result += '<img src="res/trans_crystal.png" alt="crystal" height="20" width="15">';
                    }
                    else if (value === 19)
                    {
                        result += '#CC33FF">';
                        result += '<img src="res/trans_shield.png" alt="shield" height="20" width="15">';
                    }
                    else if (value === 20)
                    {
                        result += '#CC33FF">';
                        result += '<img src="res/pick.png" alt="pick" height="20" width="15">';
                    }
                    else if (value === 103)
                    {
                        result += '#ff0066">3';
                    }
                    else if (value === 300)
                    {
                        result += '#CC33FF">';
                        result += '<img src="res/trans_mushroom_blue.png" alt="mushroom" height="20" width="15">';
                    }
                    else if (value === 301)
                    {
                        result += '#CC33FF">';
                        result += '<img src="res/trans_mushroom_pink.png" alt="mushroom" height="20" width="15">';
                    }
                    else if (value === 302)
                    {
                        result += '#CC33FF">';
                        result += '<img src="res/trans_mushroom_green.png" alt="mushroom" height="20" width="15">';
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
                    result += ' <font color="#191919">#</font> ';
                }
            }
            result += "<br>";
        }

        result += "</code></h1><br>";
        return result;
    },
    paintCanvas: function(mapObject, playerObject, ctx)
    {
        var COLOR_PINK = "#FF66FF";
        var VIEW_LENGTH_AND_WIDTH = 16;
        var FLICKER_RATE = 20;
        var vlaw = VIEW_LENGTH_AND_WIDTH;
        var i;
        var j;
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
        var random;

        var character;
        var image;
        var fillstyle;

        mapWidth = mapObject.width;
        mapHeight = mapObject.height;

        playerX = playerObject.xPos;
        playerY = playerObject.yPos;
        map = mapObject.mapArray;

        centre = Math.floor(vlaw / 2);

        ctx.font = "bold 26px Courier";
        var imageObject = new Image();

        var tile = 512 / vlaw;
        var edgeOffset = 16;

        for (i = 0; i < vlaw; i++)
        {
            for (j = 0; j < vlaw; j++)
            {
                viewX = (j - centre) + playerX;
                viewY = (i - centre) + playerY;

                image = false;
                if (viewX >= 0 && viewY >= 0 && viewX < mapWidth && viewY < mapHeight)
                {
                    value = map[viewY][viewX];

                    if (value === -1)
                    {
                        fillstyle = "red";
                        random = Math.floor(Math.random() * 2);
                        if (random === 0)
                        {
                            character = "~";
                        }
                        else
                        {
                            character = "^";
                        }
                    }
                    else if (value === 0)
                    {
                        character = ".";
                        fillstyle = "#6b6b6b";
                    }
                    else if (value === 1)
                    {
                        character = "@";
                        if (playerObject.flashBit && playerObject.phasing)
                        {
                            fillstyle = "grey";
                        }
                        else if (playerObject.flashBit)
                        {
                            fillstyle = "white";
                        }
                        else
                        {
                            fillstyle = playerObject.colour;
                        }
                    }
                    else if (value === 2)
                    {
                        character = "*";
                        fillstyle = COLOR_PINK;
                    }
                    else if (value === 3)
                    {
                        character = "3";
                        fillstyle = "#000066";
                    }
                    else if (value === 4)
                    {
                        character = "4";
                        fillstyle = "#0066ff";
                    }
                    else if (value === 5)
                    {
                        character = "5";
                        fillstyle = "#66ff66";
                    }
                    else if (value === 6)
                    {
                        character = "6";
                        fillstyle = "#ffff66";
                    }
                    else if (value === 7)
                    {
                        character = "7";
                        fillstyle = "#ff0066";
                    }
                    else if (value === 8)
                    {
                        character = "8";
                        fillstyle = "#0000cc";
                    }
                    else if (value === 9)
                    {
                        character = "9";
                        fillstyle = "#9900ff";
                    }
                    else if (value === 10)
                    {
                        image = "res/trans_mushroom.png";
                    }
                    else if (value === 12)
                    {
                        character = "#";
                        fillstyle = "grey";
                    }
                    else if (value === 14)
                    {
                        character = "o";
                        fillstyle = "#990000";
                    }
                    else if (value === 15)
                    {
                        character = "o";
                        fillstyle = "#ff0000";
                    }
                    else if (value === 16)
                    {
                        character = "*";
                        random = Math.floor(Math.random() * FLICKER_RATE);
                        if (random === 0)
                        {
                            fillstyle = "#ffffff";
                        } else
                        {
                            fillstyle = "#006600";
                        }
                    }
                    else if (value === 17)
                    {
                        character = "*";
                        random = Math.floor(Math.random() * FLICKER_RATE);
                        if (random == 0)
                        {
                            fillstyle = "#000000";
                        } else
                        {
                            fillstyle = "#990000";
                        }
                    }
                    else if (value === 18)
                    {
                        image = "res/trans_crystal.png";
                    }
                    else if (value === 19)
                    {
                        image = "res/trans_shield.png";
                    }
                    else if (value === 20)
                    {
                        image = "res/pick.png";
                    }
                    else if (value === 103)
                    {
                        character = "3";
                        fillstyle = "#ff0066";
                    }
                    else if (value === 300)
                    {
                        image = "res/trans_mushroom_blue.png";
                    }
                    else if (value === 301)
                    {
                        image = "res/trans_mushroom_pink.png";
                    }
                    else if (value === 302)
                    {
                        image = "res/trans_mushroom_green.png";
                    }
                    else
                    {
                        character = value;
                        fillstyle = "blue";
                    }
                }
                else
                {
                    character = "#";
                    fillstyle = "#191919";
                }

                if (image === false)
                {
                    ctx.fillStyle = fillstyle;
                    ctx.fillText(character, j*tile+edgeOffset, i*tile+edgeOffset);
                }
                else
                {
                    imageObject.src = image;
                    ctx.drawImage(imageObject, j*tile+edgeOffset, i*tile, 16, 16);
                }
            }
        }
    }
}
