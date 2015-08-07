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
            setMap: function(){
                this.mobs = [];
                this.mapArray = [
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [16,16,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [16,16,16,0,0,0,0,0,0,0,0,0,0,0,0],
                [16,16,16,0,0,0,0,0,0,0,0,0,0,0,0],
                [12,12,12,12,12,12,12,12,12,12,12,12,12,12,12],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                ];
                this.insertMob(7,9,7);
                this.insertMob(6,9,7);
            },
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
        width = 25;
        height = 500;
        newMap = [];
        
        for (i = 0; i < height; i++)
        {
            row = [];
            for (j = 0; j < width; j++)
            {
                random = 0;
                random = Math.floor(Math.random() * 7);
                if (random === 0)
                {
                    random = Math.floor(Math.random() * 6) + 3;
                    row[j] = random;
                    newMob = {};
                    newMob.value = random;
                    newMob.x = j;
                    newMob.y = i;
                    mapObject.mobs.push(newMob);
                }
                else if (random === 1)
                {
                    random = Math.floor(Math.random() * 9);

                    if (random == 0)
                    {
                        row[j] = 10;
                    }
                    else if (random === 1)
                    {
                        random = Math.floor(Math.random() * 6);
                        if (random === 0)
                        {
                            row[j] = 16;
                        }
                        else
                        {
                            row[j] = 0;
                        }
                    }
                    else if (random > 1 && random < 5)
                    {
                        row[j] = 14;
                    }
                    else
                    {
                        row[j] = 0;
                    }
                }
                else if (random === 2)
                {
                        random = Math.floor(Math.random() * 2);
                        if (random === 0)
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
        mapObject.width = width;
        mapObject.height = height;

        return mapObject;
    }
}
