var tmiss_generate = {
    map: function(difficulty)
    {
        var width;
        var height;
        var i;
        var j;
        var newMap;
        var row;
        var random;
        var newMob;
        var multiplierMain = 9;

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
        width = 32;
        height = 256;
        if (difficulty === "hard")
        {
            height = 512;
            width = 30;
            multiplierMain = 6;
        }
        else if (difficulty === "easy")
        {
            height = 128;
            multiplierMain = 12;
        }
        newMap = [];

        for (i = 0; i < height; i++)
        {
            row = [];
            for (j = 0; j < width; j++)
            {
                random = 0;
                random = Math.floor(Math.random() * multiplierMain);
                if (random === 0)
                { //mob
                    random = Math.floor(Math.random() * 6) + 3;
                    row[j] = random;
                    newMob = {};
                    newMob.value = random;
                    newMob.x = j;
                    newMob.y = i;
                    mapObject.mobs.push(newMob);
                }
                else if (random === 1)
                { //item
                    random = Math.floor(Math.random() * 11);

                    if (random == 0)
                    {
                        random = Math.floor(Math.random() * 4);
                        if (random === 0)
                        {
                            random = Math.floor(Math.random() * 3);
                            if (random == 0)
                            {
                                row[j] = 300;
                            }
                            else if (random == 1)
                            {
                                row[j] = 301;
                            }
                            else if (random == 2)
                            {
                                row[j] = 302;
                            }
                        }
                        else
                        {
                            row[j] = 10;
                        }
                    }
                    else if (random === 1)
                    {
                        random = Math.floor(Math.random() * 6);
                        if (random === 0)
                        {
                            row[j] = 16;
                        }
                        else if (random === 1)
                        {
                            row[j] = 17;
                        }
                        else
                        {
                            row[j] = 0;
                        }
                    }
                    else if (random === 2)
                    {
                        random = Math.floor(Math.random() * 32);
                        if (random === 0)
                        {
                            row[j] = 19;
                        }
                        else
                        {
                            row[j] = 0;
                        }
                    }
                    else if (random > 2 && random < 4)
                    {
                        row[j] = 14;
                    }
                    else
                    {
                        row[j] = 0;
                    }
                }
                else if (random === 2)
                { //wall
                        random = Math.floor(Math.random() * 10);
                        if (random < 8)
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

        mapObject.mapArray = newMap;
        mapObject.width = width;
        mapObject.height = height;

        //ensure player isn't instagib'd at start:
        tmiss_mapMutate.boxClobber(0, 0, 5, mapObject);
        mapObject.mapArray[0][0] = 1;

        mapObject.removeMob(width - 2, height - 2);
        mapObject.mapArray[height - 2][width - 2] = 2;

        return mapObject;
    }
}
