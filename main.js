(function ()
{

var MESSAGE_QUEUE_MAX = 8;
var KEY_CODE_W = 87;
var KEY_CODE_A = 65;
var KEY_CODE_S = 83;
var KEY_CODE_D = 68;
var MAP_VAL_EMPTY = 0;
var MAP_VAL_PLAYER = 1;
var MAP_VAL_MOB = 3;
var COLOR_PINK = "#FF66FF";
var map;
var mapWidth;
var mapHeight;
var mapString;
var xPos;
var yPos;
var directions;
var messageQueue;
var life;
var hitSound;
var timer;
var timerBit;
var blueBit;
var pinkBit;
var greenBit;
var mobList;
var timerHeart;
var timerExist;
var timerMoveMob;
var timerDraw;
var timerMushroom;
var timerInteractions;
var timerPlayerFlash;
var timerMovePlayer;
var currentRoundCount;
var currentKeys;

var mapObject = {
};
mapObject.map = map;
mapObject.mobs = [];

playerObject = {
};
playerObject.colour = "#00FFFF";
playerObject.blueBit = true;
playerObject.pinkBit = false;
playerObject.greenBit = false;
playerObject.flashing = false;
playerObject.flashBit = false;
playerObject.score = 1;
playerObject.xPos = 0;
playerObject.yPos = 0;
playerObject.armour = 0;
playerObject.alive = true;

currentRoundCount = 0;

directions = ["n", "s", "e", "w"];

function validTile(newX, newY)
{
    var result;
    var notTooSmall;
    var notTooBig;

    result = false;

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

function emptyTile(tileX, tileY)
{
    return (map[tileY][tileX] === 0);
}

function safeTile(tileX, tileY)
{
    var value;

    value = map[tileY][tileX];

    return (value != 1 && value != 2);
}

function validMove(newX, newY)
{
    var result;

    result = false;

    if (validTile(newX, newY))
    {
        if (emptyTile(newX, newY))
        {
            result = true;
        }
    }

    return result;
}

function clobberTile(tileX, tileY)
{
    mapObject.removeMob(tileX, tileY);
}

function moveRandomMob()
{
    var randomDirection;
    var mover;
    var random;
    
    if (mapObject.mobs.length > 0)
    {
        randomDirection = directions[Math.floor(Math.random() * 4)];
        
        random = Math.floor(Math.random() * mapObject.mobs.length);

        mover = mapObject.mobs[random];

        mobMove(randomDirection, mover.x, mover.y, mover.value);
    }

    timerMoveMob = setTimeout(moveRandomMob, 20);
}

function mobMove(direction, originX, originY, value)
{
    var result;

    result = move(direction, originX, originY, value);

    return result;
}

function move(direction, originX, originY, value)
{
    var result;
    var offsetX;
    var offsetY;
    var newX;
    var newY;
    var target;
    
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
        if (value != 1)
        {
            mapObject.removeMob(originX, originY);
            mapObject.insertMob(newX, newY, value);
        }
        else
        {
            xPos = newX;
            yPos = newY;
            playerObject.xPos = newX;
            playerObject.yPos = newY;
            map[originY][originX] = 0;
            map[newY][newX] = value;
            result[0] = newX;
            result[1] = newY;
        }
    }
    else if (validTile(newX, newY) && value === 1)
    {
        target = map[newY][newX];
        playerBump(target, newX, newY, offsetX, offsetY);
    }

    return result;
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

function spell()
{
    var i;
    var j;
    var k;
    var tileX;
    var tileY;

    newMessage("You cast a spell!");
    tmiss_sound.magic();

    for (i = -1; i < 2; i++)
    {
        for (j = -1; j < 2; j++)
        {
            tileX = xPos + j;
            tileY = yPos + i;
            if (validTile(tileX, tileY) && map[tileY][tileX] > 2)
            {
                clobberTile(tileX, tileY);
                map[tileY][tileX] = 0;
                k += 1;
            }
        }
    }

    if (k === 0)
    {
        newMessage("Nothing happened...");
    }
}

function playerMover()
{
    var moveTime = 250;

    if (playerObject.blueBit)
    {
        moveTime = 100;
    }
    if (currentKeys.length > 0)
    {
        move(currentKeys[currentKeys.length - 1], xPos, yPos, MAP_VAL_PLAYER);
    }

    timerMovePlayer = setTimeout(playerMover, moveTime);
}

document.onkeydown = function(e)
{
    var direction;
    var newCoords;
    var key = e.keyCode ? e.keyCode : e.which;
                
    direction = "";
    if (key === KEY_CODE_W)
    {
        direction = "n";
    }
    else if (key === KEY_CODE_D)
    {
        direction = "e";
    }
    else if (key === KEY_CODE_S)
    {
        direction = "s";
    }
    else if (key === KEY_CODE_A)
    {
        direction = "w";
    }

    if (direction === "")
    {
    }
    else
    {
        if (currentKeys.indexOf(direction) === -1)
        {
            move(direction, xPos, yPos, MAP_VAL_PLAYER);

            currentKeys.push(direction);
            clearTimeout(timerMovePlayer);
            timerMovePlayer = setTimeout(playerMover, 500);
        }
    }
}

document.onkeyup = function(e)
{
    var direction;
    var key = e.keyCode ? e.keyCode : e.which;
    var value;
                
    direction = "";
    if (key === KEY_CODE_W)
    {
        direction = "n";
    }
    else if (key === KEY_CODE_D)
    {
        direction = "e";
    }
    else if (key === KEY_CODE_S)
    {
        direction = "s";
    }
    else if (key === KEY_CODE_A)
    {
        direction = "w";
    }
    else if (key === 80)
    {
        life -= 5;
        quickUpdate();
        alert("You exchange some life energy to suspend time.");
    }
    else if (key === 81)
    {
        if (life > 50)
        {
            life -= 50;
            spell();
        }
        else
        {
            newMessage("You feel too weak for that.");
        }
    }
    else if (key === 82)
    {
        life += 5000;
        timer += 5000;
    }

    if (direction === "")
    {
    }
    else
    {
        value = currentKeys.indexOf(direction);
        currentKeys.splice(value, 1);
        if (currentKeys.length === 0)
        {
            clearTimeout(timerMovePlayer);
        }
    }
}

function drawMap()
{
    mapString = tmiss_draw.viewString(mapObject, playerObject);
    document.getElementById("left").innerHTML = mapString;
    timerDraw = setTimeout(drawMap, 100);
}

function flashMap(counter)
{
    mapString = "";
    document.getElementById("left").innerHTML = mapString;
    timerDraw = setTimeout(drawMap, 100);
}

function playerInteractions()
{
    var i;
    var j;
    var current;
    var rc;
    var tileX;
    var tileY;

    for (i = -1; i < 2; i++)
    {
        for (j = -1; j < 2; j++)
        {
            tileX = xPos + j;
            tileY = yPos + i;
            if (validTile(tileX, tileY))
            {
                current = map[tileY][tileX];
                if (current > 1)
                {
                    rc = playerInteract(current, tileX, tileY);
                }
            }

            if (rc === -1)
            {
                return;
            }
        }
    }

    timerInteractions = setTimeout(playerInteractions, 500);
}

function playerInteract(value, valueX, valueY)
{
    var random;
    var i;
    var j;
    var result;
    var message;
    var done;
    var timeOut;

    result = 0;

    if (value === 2)
    {
        winGame();
        result = -1;
    }
    else if (value === 3)
    {
        random = 1;
        if (playerObject.blueBit)
        {
            random = Math.floor(Math.random() * 3);
        }

        if (random != 0)
        {
            newMessage("3 bites you with glee!");
            playerHit(1);

            if (life < 1)
            {
                result = -1;
            }
            else if (playerObject.greenBit)
            {
                random = Math.floor(Math.random() * 2);
                if (random === 0)
                {
                    newMessage("You grab the 3 and hurl it into the distance!");
                    clobberTile(valueX, valueY);
                }
                else
                {
                    newMessage("You reach for the 3 but it deftly scampers away.");
                }

            }
        }
        else
        {
            newMessage("You narrowly evade 3's attack!");
        }
    }
    else if (value === 4)
    {
        newMessage("4 propagates.");
        i = 0;
        j = 0;

        while (i < 4)
        {
            random = randomTile();
            if (emptyTile(random[0], random[1]))
            {
                mapObject.insertMob(random[0], random[1], 4);
                j += 1;
            }

            i += 1;
        }

        if (j === 0)
        {
            newMessage("4 failed to propagate!");
        }

        random = Math.floor(Math.random() * 2);
        if (random === 0)
        {
            clobberTile(valueX, valueY);
        }
        else
        {
            newMessage("4 metamorphosizes into 8!");
            mapObject.removeMob(valueX, valueY);
            mapObject.insertMob(valueX, valueY, 8);
        }
    }
    else if (value === 5)
    {
        random = 1;
        if (playerObject.blueBit)
        {
            random = Math.floor(Math.random() * 5);
        }
        newMessage("5 shatters in your general direction!");
        random = Math.floor(Math.random() * 21) + 5;
        playerHit(random);
        mapObject.removeMob(valueX, valueY);

        if (life < 1)
        {
            result = -1;
        }
        if (random == 0)
        {
            newMessage("You narrowly evade 5's attack!");
        }
    }
    else if (value === 6)
    {
        newMessage("6 whistles a funeral dirge and evaporates.");
        i = 0;

        while (i < 6)
        {
            random = randomTile();
            if (emptyTile(random[0], random[1]))
            {
                mapObject.insertMob(random[0], random[1], 7);
            }

            i += 1;
        }
        mapObject.removeMob(valueX, valueY);
    }
    else if (value === 7)
    {
        newMessage("7 touches base with you.");
        gameOver("7 8 u  :(");
        result = -1;
    }
    else if (value === 8)
    {
        message = "8 grins mischievously.";
        if (messageQueue[0] === message || messageQueue[1] === message)
        {
        }
        else
        {
            newMessage(message);
        }
    }
    else if (value === 9)
    {
        message = "9 beams at you and you get rock hard!";
        if (messageQueue[0] === message || messageQueue[1] === message)
        {
        }
        else
        {
            newMessage(message);
        }
        playerObject.armour = 5;
    }
    else if (value === 10)
    {
        tmiss_generate.map();
        tmiss_sound.eat();
        newMessage("You devour a curious looking mushroom.");
        map[valueY][valueX] = 0;
        life += 6;
    }    
    else if (value === 13)
    {
        //reserved
    }
    else if (value === 16)
    {
        done = false;
        i = 0;

        while (!done)
        {
            random = randomTile();
            if (emptyTile(random[0], random[1]) && (yPos - random[1] < 128 && yPos - random[1] > -128))
            {
                done = true;
                newMessage("You are drawn into the event horizon.");
                map[valueY][valueX] = 0;
                map[yPos][xPos] = 0;
                playerObject.xPos = random[0];
                playerObject.yPos = random[1];
                xPos = random[0];
                yPos = random[1];
                map[random[1]][random[0]] = 1;
            }

            i += 1;
            if (i === 2)
            {
                done = true;
            }
        }
    }

    return result;
}

function playerBump(value, valueX, valueY, offsetX, offsetY)
{
    var random;
    var i;
    var j;
    var result;
    var message;
    var done;
    var timeOut;

    if (value === 14 && playerObject.pinkBit)
    {
        newMessage("You light the fuse...");
        map[valueY][valueX] = 15;
        timeOut = setTimeout(function(){tmiss_mapMutate.explosion(valueX, valueY, mapObject, playerObject, validTile, newMessage, true)}, 5000);
        if (mapObject.boomAlert[valueY] === undefined)
        {
            mapObject.boomAlert[valueY] = [];
        }

        mapObject.boomAlert[valueY][valueX] = timeOut;
    }
    else if (value === 15 && playerObject.pinkBit)
    {
        newMessage("You deliver a solid boot.");
        bootItem(valueX, valueY, offsetX, offsetY, true);
    }
    else if ((value === 12 || value === 14) && playerObject.greenBit)
    {
        if (map[newY + offsetY][newX + offsetX] === 0)
        {
            newMessage("You shove with all your might!");
            map[newY + offsetY][newX + offsetX] = map[newY][newX];
            map[newY][newX] = 0;
        }
    }
}

function bootItem(tileX, tileY, offsetX, offsetY, travel)
{
    var value;
    var newX;
    var newY;
    var array;

    newX = tileX + offsetX;
    newY = tileY + offsetY;

    if (map[newY][newX] === 0)
    {
        value = map[tileY][tileX];
        map[tileY][tileX] = 0;
        map[newY][newX] = value;

        if (value === 15)
        {
            array = mapObject.boomAlert;
            clearTimeout(array[tileY][tileX]);
            if (array[newY] === undefined)
            {
                array[newY] = [];
            }
            array[newY][newX] = setTimeout(function(){tmiss_mapMutate.explosion(newX, newY, mapObject, playerObject, validTile, newMessage, true)}, 5000);
        }

        if (travel)
        {
            bootItem(newX, newY, offsetX, offsetY, travel);
        }
    }
}

function armourBuff()
{
    var result;

    result = false;

    if (playerObject.armour > 0)
    {
        newMessage("Your hard body absorbs the attack!");
        result = true;
        playerObject.armour -= 1;
        if (playerObject.armour === 0)
        {
            newMessage("You are suddenly not so hard anymore...");
        }
    }

    return result;
}

function playerHit(damage)
{
    if (!armourBuff())
    {
        //tmiss_sound.hit();
        life -= damage;

        clearTimeout(timerPlayerFlash);
        timerPlayerFlash = setTimeout(function(){playerFlash(10)}, 200);
        playerObject.flashBit = true;
    }
}

function playerFlash(counter)
{
    if (counter > 0)
    {
        if (counter % 2 === 0)
        {
            playerObject.flashBit = false;
        }
        else
        {
            playerObject.flashBit = true;
        }
        timerPlayerFlash = setTimeout(function(){playerFlash(counter - 1)}, 200);
    }
    else if (counter === 0)
    {
        playerObject.flashBit = false;
    }
}

function randomMush()
{
    var millisecs;
    var random;

    millisecs = (Math.floor(Math.random() * 11) + 25) * 1000;

    random = randomTile();

    if (emptyTile(random[0], random[1]))
    {
        map[random[1]][random[0]] = 10;
    }

    timerMushroom = setTimeout(randomMush, millisecs);
}


function winGame()
{
    quickUpdate();
    tmiss_sound.win();
    playerObject.score += (timer * 7);
    window.alert("You win! Good job! Final score: " + playerObject.score);
    endGame();
}

function quickUpdate()
{
    clearTimeout(timerDraw);
    drawMap();
    updateStatusPane();
}

function gameOver(message)
{
    //just in case player was ninja'd:
    quickUpdate();

    tmiss_sound.death();
    playerObject.alive = false;
    endGame();
    window.alert("Game Over: " + message);
}

function endGame()
{
    var i;
    var j;
    var array;

    array = mapObject.boomAlert;

    for (i = 0; i < array.length; i++)
    {
        if (array[i])
        {
            for (j = 0; j < array[i].length; j++)
            {
                clearTimeout(array[i][j]);
            }
        }
    }

    clearTimeout(timerPlayerFlash);
    clearTimeout(timerHeart);
    clearTimeout(timerExist);
    clearTimeout(timerMoveMob);
    clearTimeout(timerDraw);
    clearTimeout(timerInteractions);
    clearTimeout(timerMushroom);
    clearTimeout(timerPlayerFlash);
    clearTimeout(timerMovePlayer);
    setTimeout(startGame, 1000);
}

function doIExist()
{
    if (map[yPos][xPos] != 1)
    {
        gameOver("You (violently) ceased to exist.");
    }
    else
    {
        timerExist = setTimeout(doIExist, 50);
    }
}

function heartBeat()
{
    var dead;

    dead = false;

    if (life < 1)
    {
        gameOver('You collapsed.');
        dead = true;
    }

    if (timer < 1)
    {
        gameOver("You didn't make it in time.");
        dead = true;
    }
    else
    {
        if (timerBit)
        {
            timer -= 1;
            timerBit = false;
        }
        else
        {
            timerBit = true;
        }
    }

    updateStatusPane();
    if (!dead)
    {
        timerHeart = setTimeout(heartBeat, 500);
    }
}

function updateStatusPane()
{
    var pane;
    var i;

    pane = document.getElementById("bottom");
    pane.innerHTML = "";
    for (i = 0; i < MESSAGE_QUEUE_MAX; i++)
    {
        if (i != 0)
        {
            pane.innerHTML += '<font color="grey">' + "<h4>" + messageQueue[i] + "</h4>" + "</font>";
        }
        else
        {
            pane.innerHTML += '<font color="lime">' + "<h2>" + messageQueue[i] + "</h2>" + "</font>";
        }
    }

    pane = document.getElementById("top");
    pane.innerHTML = "";

    pane.innerHTML += '<font size="6" color="green">' + "Life: " + life + "</font>&emsp;";
    pane.innerHTML += '<font size="6" color="red">' + "Time: " + timer + "</font>&emsp;";
    pane.innerHTML += '<font size="6" color="blue">' + "Score: " + playerObject.score + "</font>";

}

function newMessage(message)
{
    var i;

    for (i = MESSAGE_QUEUE_MAX - 1; i > 0; i--)
    {
        messageQueue[i] = messageQueue[i - 1];
    }

    messageQueue[0] = message;
}

function newGame()
{
    xPos = 0;
    yPos = 0;
    playerObject.xPos = 0;
    playerObject.yPos = 0;
    playerObject.alive = true;
    playerObject.flashBit = false;
    playerObject.armour = 0;
    playerObject.score = 1;

    currentKeys = [];

    currentRoundCount += 1;

    mapObject = tmiss_generate.map();

    map = mapObject.mapArray;
    mapWidth = map[0].length;
    mapHeight = map.length;

    mapObject.boomAlert = [];

    messageQueue = [];
    for (var i = 0; i < MESSAGE_QUEUE_MAX; i++)
    {
        newMessage("");
    }
    newMessage('<font color="' + "lime" + '">Objective: Rescue the '+ '</font><font color="' + COLOR_PINK + '">!</font>');

    life = 64;
    timer = 1024;
    timerBit = false;
}

function startGame()
{
    var input;
    var done;
    var preset;

    newGame();

    if (map.length < 5 || map[0].length < 5)
    {
        throw new Error("Illegal map dimensions.");
    }

    done = false;
    
    while (!done)
    {
        if (playerObject.pinkBit)
        {
            preset = "p";
        }
        else if (playerObject.greenBit)
        {
            preset = "g";
        }
        else
        {
            preset = "b";
        }

        input = window.prompt("Select Player: (type b for blue or p for pink or g for green)", preset);
        if (input === "b")
        {
            playerObject.blueBit = true;
            playerObject.pinkBit = false;
            playerObject.greenBit = false;
            playerObject.colour = "#00FFFF";
            done = true;
        }
        else if (input === "p") 
        {
            playerObject.blueBit = false;
            playerObject.pinkBit = true;
            playerObject.greenBit = false;
            playerObject.colour = COLOR_PINK;
            done = true;
        }
        else if (input === "g") 
        {
            playerObject.blueBit = false;
            playerObject.pinkBit = false;
            playerObject.greenBit = true;
            playerObject.colour = "#00FF00";
            done = true;
        }
    }
    
    timerHeart = setTimeout(heartBeat, 500);
    timerExist = setTimeout(doIExist, 50);
    timerMoveMob = setTimeout(moveRandomMob, 25);
    timerDraw = setTimeout(drawMap, 25);
    timerInteractions = setTimeout(playerInteractions, 25);
    timerMushroom = setTimeout(randomMush, 30);
}

var canvasWidth;
var canvasHeight;
var canvas;
var canvasOffset;

canvas = document.getElementById('canvas');
canvasWidth = canvas.width;
canvasHeight = canvas.height;
canvasOffset = 100;

var context = canvas.getContext('2d');

context.canvas.addEventListener('mousedown', function(event)
{  
    var xp = event.clientX - context.canvas.offsetLeft;
    var yp = event.clientY - context.canvas.offsetTop;

    if (yp < canvasOffset)
    {
        move('n', xPos, yPos, MAP_VAL_PLAYER);
    }
    else if (yp > canvasHeight - canvasOffset)
    {
        move('s', xPos, yPos, MAP_VAL_PLAYER);
    }
    else if (xp < canvasOffset)
    {
        move('w', xPos, yPos, MAP_VAL_PLAYER);
    }
    else if (xp > canvasWidth - canvasOffset)
    {
        move('e', xPos, yPos, MAP_VAL_PLAYER);
    }

});

context.canvas.addEventListener('mouseup', function(event)
{  
});


var elm = document.body;

var catcher = function(evt) {
    if (evt.touches.length > 2)
        evt.preventDefault();
};

elm.addEventListener('touchstart', catcher, true);

startGame();

}());
