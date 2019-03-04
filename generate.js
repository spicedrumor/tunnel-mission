var trun_generate = {
    map: function(difficulty)
    {
        var width;
        var height;
        var i;
        var j;
        var newMap;
        var row;
        var random;
        var mobValue;
        var newMob;
        var multiplierMain;
        var redThreeMult;

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
                let mobs = this.mobs;
                let mapArray = this.mapArray;

                let newMob = {
                   x: mobX,
                   y: mobY,
                   value: value
                };
                mobs.push(newMob);
                mapArray[mobY][mobX] = value;
            }
        };
        width = 32;
        function rng(value)
        {
            return Math.floor(Math.random() * value);
        }
        height = 512;
        multiplierMain = 8;
        redThreeMult = 10;
        if (difficulty === "hard")
        {
            height = 1024;
            width = 28;
            multiplierMain = 5;
            redThreeMult = 7;
        }
        else if (difficulty === "easy")
        {
            multiplierMain = 10;
        }
        newMap = [];

        for (i = 0; i < height; i++)
        {
            row = [];
            for (j = 0; j < width; j++)
            {
                random = 0;
                random = rng(multiplierMain);
                if (random === 0)
                { //mob generation:
                    mobValue = rng(6) + 3;
                    if (mobValue === 3)
                    {
                        random = rng(redThreeMult);
                        if (random === 0)
                        {
                            mobValue = 103;
                        }
                    }
                    if (mobValue === 7)
                    {
                        random = rng(2);
                        if (random === 0)
                        {
                            mobValue = rng(6) + 3;
                        }
                    }
                    row[j] = mobValue;
                    newMob = {};
                    newMob.value = mobValue;
                    newMob.x = j;
                    newMob.y = i;
                    mapObject.mobs.push(newMob);
                }
                else if (random === 1)
                { //item generation:
                    random = rng(11);

                    if (random === 0)
                    {
                        random = rng(4);
                        if (random === 0)
                        {
                            random = rng(3);
                            if (random === 0)
                            {
                                row[j] = 300;
                            }
                            else if (random === 1)
                            {
                                row[j] = 301;
                            }
                            else if (random === 2)
                            {
                                row[j] = 302;
                            }
                        }
                        else
                        {
                            if (rng(5) === 0) {
                                row[j] = 11;
                            } else {
                                row[j] = 10;
                            }
                        }
                    }
                    else if (random === 1)
                    {
                        random = rng(6);
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
                        random = rng(64);
                        if (random === 0)
                        {
                            row[j] = 19;
                        }
                        else if (random === 1)
                        {
                            row[j] = 20;
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
                else if (random === 2 || random === 3)
                { //wall
                        random = rng(10);
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
        mapObject.difficulty = difficulty;

        //ensure player is set correctly:
        tmiss_mapMutate.boxClobber(0, 0, 5, mapObject);
        mapObject.mapArray[0][0] = 1;

        mapObject.removeMob(width - 2, height - 2);
        mapObject.mapArray[height - 2][width - 2] = 2;

        return mapObject;
    }
}
