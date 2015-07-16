var tmiss_generate = {
    map: function()
    {
        var width;
        var height;
        var i;
        var j;
        var newMap;
        var row;
        var random;

        width = 38;
        height = 20;
        newMap = [];
        
        for (i = 0; i < height; i++)
        {
            row = [];
            for (j = 0; j < width; j++)
            {
                random = Math.floor(Math.random() * 7);
                if (random == 0)
                {
                    row[j] = Math.floor(Math.random() * 6) + 3;
                }
                else if (random == 1)
                {
                    random = Math.floor(Math.random() * 9);

                    if (random == 0)
                    {
                        row[j] = 10;
                    }
                    else if (random == 1)
                    {
                        random = Math.floor(Math.random() * 2);
                        if (random == 0)
                        {
                            row[j] = 14;
                        }
                        else
                        {
                            row[j] = 0;
                        }
                    }
                    else if (random == 2)
                    {
                        random = Math.floor(Math.random() * 8);
                        if (random == 0)
                        {
                            row[j] = 16;
                        }
                        else
                        {
                            row[j] = 0;
                        }
                    }
                    else if (random == 3 || random == 4)
                    {
                        row[j] = 12;
                    }
                    else
                    {
                        row[j] = 0;
                    }
                }
                else
                {
                    row[j] = 0;
                }
            }
            newMap[i] = row;
            row = [];
        }

        newMap[0][0] = 1;
        newMap[height - 2][width - 2] = 2;
        //ensure player isn't instagib'd at start:
        newMap[0][1] = 0;
        newMap[1][0] = 0;
        newMap[1][1] = 0;

        return newMap;
    }
}
