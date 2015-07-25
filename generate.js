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
        var newMob;

        var mapObject = {
            mapArray: [],
            mobs: [],
            removeMob: function(mobX, mobY){
                var i;
                var found;
                var result;
                var mobs = this.mobs;
                var mapArray = this.mapArray;

                result = false;

                found = false;
                for (var i = 0; i < mobs.length; i++)
                {
                    if (mobs[i].x == mobX && mobs[i].y == mobY)
                    {
                        found = true;
                        break;
                    }
                }

                if (found)
                {
                    mobs.splice(i, 1);
                    mapArray[mobY][mobX] = 0;
                    result = true;
                }

                return result;
            },
            insertMob: function(mobX, mobY, value){
                var newMob;
                var mobs = this.mobs;
                var mapArray = this.mapArray;

                newMob = {
                   x: mobX,
                   y: mobY,
                   value: value
                };
                mobs.push(newMob);
                mapArray[mobY][mobX] = value;
            }
        };
        width = 52;
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
                    random = Math.floor(Math.random() * 6) + 3;
                    row[j] = random;
                    newMob = {};
                    newMob.value = random;
                    newMob.x = j;
                    newMob.y = i;
                    mapObject.mobs.push(newMob);
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
                        row[j] = 14;
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

        mapObject.mapArray = newMap;

        return mapObject;
    }
}
