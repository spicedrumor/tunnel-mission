var tmiss_draw = {
    mapToString: function(map, blueBit)
    {
        var MAP_VAL_EMPTY = 0;
        var MAP_VAL_PLAYER = 1;
        var MAP_VAL_MOB = 3;
        var COLOR_PINK = "#FF66FF";
        var i;
        var j;
        var result;

        result = "<h1><code>";
        for (i = 0; i < map.length; i++)
        {
            for (j = 0; j < map[0].length; j++)
            {
                result += '<font color="';
                if (map[i][j] == 0)
                {
                    result += '#6B6B6B">.';
                }
                else if (map[i][j] == 1)
                {
                    if (blueBit)
                    {
                        result += '#00FFFF">@';
                    }
                    else
                    {
                        result += COLOR_PINK;
                        result += '">@';
                    }
                }
                else if (map[i][j] == 2)
                {
                    result += COLOR_PINK;
                    result += '">!';
                }
                else if (map[i][j] == 3)
                {
                    result += '#000066">3';
                }
                else if (map[i][j] == 4)
                {
                    result += '#0066FF">4';
                }
                else if (map[i][j] == 5)
                {
                    result += '#66FF66">5';
                }
                else if (map[i][j] == 6)
                {
                    result += '#FFFF66">6';
                }
                else if (map[i][j] == 7)
                {
                    result += '#FF0066">7';
                }
                else if (map[i][j] == 8)
                {
                    result += '#0000CC">8';
                }
                else if (map[i][j] == 9)
                {
                    result += '#9900FF">9';
                }
                else if (map[i][j] == 10)
                {
                    result += '#CC33FF">';
                    result += '<img src="res/trans_mushroom.png" alt="mushroom" height="20" width="15">';
                }
                else if (map[i][j] == 12)
                {
                    result += 'grey">';
                    result += '#';
                }
                else if (map[i][j] == 14)
                {
                    result += 'red">';
                    result += 'o';
                }
                else if (map[i][j] == 15)
                {
                    result += 'red">';
                    result += 'o';
                }
                else if (map[i][j] == 16)
                {
                    result += '#000A00">';
                    result += '*';
                }
                else
                {
                    result += 'blue">';
                    result += map[i][j];
                }
                result += '</font>';
            }
            result += "<br>";
        }

        result += "</code></h1><br>";
        return result;
    }
}
