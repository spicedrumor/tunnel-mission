(function ()
{

var MESSAGE_QUEUE_MAX = 8;
var KEY_CODE_W = 87;
var KEY_CODE_A = 65;
var KEY_CODE_S = 83;
var KEY_CODE_D = 68;
var KEY_CODE_E = 69;
var MAP_VAL_EMPTY = 0;
var MAP_VAL_PLAYER = 1;
var MAP_VAL_MOB = 3;
var COLOR_PINK = "#FF66FF";
var MAX_PLOUGH = 5;
var SEVENER_SCORE_VALUE = 15;
var SPELL_COST = 32;
var map;
var mapString;
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
var timerPlayerPhasing;
var timerMovePlayer;
var currentRoundCount;
var currentKeys;
var difficulty;
var SMILESTARTSIZE = 128;
var SMILEHITCOUNT = 16;
var smileReduction = SMILESTARTSIZE / SMILEHITCOUNT;
var smileCurSize;

difficulty = "normal";

//TODO: game object
//    - contain mapObj, playerObj
//    - contain difficulty, time, etc.

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
playerObject.phasing = false;
playerObject.score = 1;
playerObject.xPos = 0;
playerObject.yPos = 0;
playerObject.armour = 0;
playerObject.alive = true;
playerObject.hasShield = false;
playerObject.shieldCount = 0;
playerObject.hasPick = false;
playerObject.pickCount = 0;
playerObject.wielded = "nothing";
playerObject.powerMove = false;
playerObject.hitRecently = 0;
playerObject.blockRecently = 0;
playerObject.armourReduction = 0;

currentRoundCount = 0;

directions = ["n", "s", "e", "w"];

function validTile(tileX, tileY)
{
    var result;
    var notTooSmall;
    var notTooBig;

    result = false;

    if (tileX >= 0 && tileY >= 0)
    {
            notTooSmall = true;
    }
    if (tileX < mapObject.width && tileY < mapObject.height)
    {
        notTooBig = true;
    }

    if (notTooSmall && notTooBig)
    {
        result = true;
    }

    return result;
}

function clearTile(tileX, tileY)
{
    return (validTile(tileX, tileY) && emptyTile(tileX, tileY));
}

function smashableTile(tileX, tileY)
{
    var result;
    var target;

    result = false;

    target = map[tileY][tileX];

    if (target === 12 || target === 0)
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

function validSmash(newX, newY)
{
    var result;

    result = false;

    if (validTile(newX, newY))
    {
        if (smashableTile(newX, newY))
        {
            result = true;
        }
    }

    return result;
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

    if (value > 100)
    {
        result = clingyMobMove(originX, originY, value);
        result = clingyMobMove(result[0], result[1], value);
    }
    else
    {
        result = move(direction, originX, originY, value);
    }

    return result;
}

function ploughThrough(originX, originY, offsetX, offsetY, value, count, slain)
{
    if (count > 0 && validTile(originX + offsetX, originY + offsetY))
    {
        tmiss_sound.magic();
        var newX;
        var newY;

        newX = originX + offsetX;
        newY = originY + offsetY;
        playerObject.xPos = newX;
        playerObject.yPos = newY;

        map[originY][originX] = 0;
        if (map[newY][newX] === 7)
        {
            slain += 1;
            sevenDown(slain);
            life += 16;
            timer += 16;
        }
        else if (map[newY][newX] === 2)
        {
            winGame();
        }
        clobberTile(newX, newY);
        map[newY][newX] = value;

        ploughThrough(newX, newY, offsetX, offsetY, value, count - 1, slain);
    }
    else if (count === MAX_PLOUGH)
    {
        newMessage("That would be a very bad idea... ");
    }
    else
    {
        newMessage("You suddenly feel drained.");
        playerObject.powerMove = false;
    }
}

function powerMove(direction, originX, originY, value)
{
    var offsetValues;
    var offsetX;
    var offsetY;
    var newX;
    var newY;

    offsetValues = getOffset(direction);
    offsetX = offsetValues[0];
    offsetY = offsetValues[1];

    newX = originX + offsetX;
    newY = originY + offsetY;

    ploughThrough(originX, originY, offsetX, offsetY, value, MAX_PLOUGH, 0);
}

function getOffset(direction)
{
    var result;
    var offsetX;
    var offsetY;

    result = [];
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

    result[0] = offsetX;
    result[1] = offsetY;

    return result;
}

function clingyMobMove(originX, originY, value)
{
    var offsetValues;
    var offsetX;
    var offsetY;
    var newX;
    var newY;
    var result;
    var random;

    offsetX = 0;
    offsetY = 0;

    result = [];
    result[0] = originX;
    result[1] = originY;

    if (playerObject.xPos > originX)
    {
        offsetX = 1;
    }
    if (playerObject.xPos < originX)
    {
        offsetX = -1;
    }
    if (playerObject.yPos > originY)
    {
        offsetY = 1;
    }
    if (playerObject.yPos < originY)
    {
        offsetY = -1;
    }

    newX = originX + offsetX;
    newY = originY + offsetY;


    if (validSmash(newX, newY))
    {
        result[0] = newX;
        result[1] = newY;

        mapObject.removeMob(originX, originY);
        mapObject.insertMob(newX, newY, value);
    }

    return result;
}

function move(direction, originX, originY, value)
{
    var result;
    var offsetValues;
    var offsetX;
    var offsetY;
    var newX;
    var newY;
    var target;

    result = [];
    result[0] = originX;
    result[1] = originY;

    offsetValues = getOffset(direction);
    offsetX = offsetValues[0];
    offsetY = offsetValues[1];

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
    var hit;
    var tileX;
    var tileY;
    var target;
    var slain;
    var random;
    var xPos;
    var yPos;

    xPos = playerObject.xPos;
    yPos = playerObject.yPos;

    life -= SPELL_COST;

    if (playerObject.blueBit)
    {
        newMessage("Your entire body tenses.");
        playerObject.powerMove = true;
    }
    else if (playerObject.pinkBit)
    {
        hit = false;
        for (i = -1; i < 2; i++)
        {
            for (j = -1; j < 2; j++)
            {
                tileX = xPos + j;
                tileY = yPos + i;
                if (validTile(tileX, tileY))
                {
                    target = map[tileY][tileX];
                    if (validTile(tileX, tileY) && target > 1 && target < 10)
                    {
                        hit = true;
                    }
                }
            }
        }

        if (hit)
        {
            newMessage("You feel too crowded for that.");
        }
        else
        {
            newMessage("You call upon that which you hold most dear... ");
            if (clearTile(xPos - 1, yPos - 1))
            {
                map[yPos - 1][xPos - 1] = 14;
            }
            if (clearTile(xPos + 1, yPos - 1))
            {
                map[yPos - 1][xPos + 1] = 14;
            }
            if (clearTile(xPos - 1, yPos + 1))
            {
                map[yPos + 1][xPos - 1] = 14;
            }
            if (clearTile(xPos + 1, yPos + 1))
            {
                map[yPos + 1][xPos + 1] = 14;
            }
        }
    }
    else if (playerObject.greenBit)
    {
        tmiss_sound.magic();
        newMessage("You focus on your chi... ");
        hit = false;
        slain = 0;
        for (i = -1; i < 2; i++)
        {
            for (j = -1; j < 2; j++)
            {
                tileX = xPos + j;
                tileY = yPos + i;
                target = map[tileY][tileX];
                if (validTile(tileX, tileY) && target > 2)
                {
                    hit = true;
                    target = map[tileY][tileX];
                    clobberTile(tileX, tileY);
                    if (target === 7)
                    {
                        slain += 1;
                        map[tileY][tileX] = 18;
                        sevenDown(slain);
                    }
                    else
                    {
                        map[tileY][tileX] = 0;
                    }
                }
            }
        }
        if (!hit)
        {
            newMessage("Nothing happened...");
        }
    }


}

function sevenDown(count)
{
    if (count === 1)
    {
        newMessage("A 7 has fallen!");
        playerObject.score += SEVENER_SCORE_VALUE;
    }
    else if (count === 2)
    {
        newMessage("Multi-Kill!");
        playerObject.score += SEVENER_SCORE_VALUE * 2;
    }
    else if (count === 3)
    {
        newMessage("Mega-Kill!");
        playerObject.score += SEVENER_SCORE_VALUE * 4;
    }
    else if (count > 4)
    {
        newMessage("M-M-M-MONSTER KILL!!!");
        playerObject.score += SEVENER_SCORE_VALUE * 8;
    }
}

function playerMover()
{
    var xPos;
    var yPos;
    var moveTime = 200;

    xPos = playerObject.xPos;
    yPos = playerObject.yPos;

    if (playerObject.blueBit)
    {
        moveTime = 80;
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
    var xPos;
    var yPos;

    xPos = playerObject.xPos;
    yPos = playerObject.yPos;

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
            if (playerObject.powerMove)
            {
                powerMove(direction, xPos, yPos, MAP_VAL_PLAYER);
            }
            else
            {
                move(direction, xPos, yPos, MAP_VAL_PLAYER);

                currentKeys.push(direction);
                clearTimeout(timerMovePlayer);
                timerMovePlayer = setTimeout(playerMover, 500);
            }
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
    else if (key === KEY_CODE_E)
    {
        if (playerObject.hasPick)
        {
            if (playerObject.wielded === "nothing")
            {
                newMessage("You wield your pick.");
                playerObject.wielded = "pick";
            }
            else
            {
                newMessage("You stop wielding your pick.");
                playerObject.wielded = "nothing";
            }
        }
        else
        {
            newMessage("You have nothing to equip.");
        }
    }
    else if (key === 72)
    {
        tmiss_help.menu();
    }
    else if (key === 73)
    {
        newMessage("You check your inventory...");
        if (playerObject.hasShield)
        {
            newMessage("You are carrying a banged-up metal shield.");
        }
        else
        {
            newMessage("Your inventory is empty.");
        }
    }
    else if (key === 80)
    {
        life -= 5;
        quickUpdate();
        alert("You exchange some life energy to suspend time.");
    }
    else if (key === 81)
    {
        if (life > SPELL_COST)
        {
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
    //mapString = tmiss_draw.createHTMLString(mapObject, playerObject);
    //document.getElementById("left").innerHTML = mapString;
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
            tileX = playerObject.xPos + j;
            tileY = playerObject.yPos + i;
            if (validTile(tileX, tileY))
            {
                current = map[tileY][tileX];
                if (current != 0)
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
    var newX;
    var newY;
    var i;
    var j;
    var result;
    var message;
    var done;
    var timeOut;

    result = 0;

    if (value === -1)
    {
        newMessage("The flames lick at you!");
        playerHit(1);
    }
    else if (value === 2)
    {
        winGame();
        result = -1;
    }
    else if (value === 3)
    {
        random = 1;
        if (playerObject.blueBit)
        {
            random = Math.floor(Math.random() * 2);
        }

        if (random === 0)
        {
            newMessage("You narrowly evade 3's attack!");
        }
        else
        {
            random = Math.floor(Math.random() * 4);
            if (playerObject.hasShield && random === 0)
            {
                newMessage("You manage to block 3's attack!");
                playerObject.blockRecently = 15;
            }
            else
            {
                newMessage("3 bites you with glee!");
                playerHit(1);
            }

            if (life > 0 && playerObject.greenBit)
            {
                random = Math.floor(Math.random() * 2);
                if (random === 0)
                {
                    playerObject.score += 10;
                    newMessage("You grab the 3 and hurl it into the distance!");
                    clobberTile(valueX, valueY);
                }
                else
                {
                    newMessage("You reach for the 3 but it deftly scampers away.");
                }
            }
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

        random = Math.floor(Math.random() * 3);
        if (random === 0)
        {
            newMessage("4 metamorphosizes into 8!");
            mapObject.removeMob(valueX, valueY);
            mapObject.insertMob(valueX, valueY, 8);
        }
        else
        {
            clobberTile(valueX, valueY);
        }
    }
    else if (value === 5)
    {
        random = 1;
        if (playerObject.blueBit)
        {
            random = Math.floor(Math.random() * 2);
        }

        if (random === 0)
        {
            newMessage("You narrowly evade 5 as it shatters apart!");
        }
        else
        {
            if (playerObject.hasShield)
            {
                newMessage("Your shield absorbs some of 5's shrapnel!");
                random = Math.floor(Math.random() * 21) + 5;
                random -= (2 * playerObject.shieldCount)
                playerObject.blockRecently = 15;
            }
            else
            {
                newMessage("5 shatters in your general direction!");
                random = Math.floor(Math.random() * 21) + 5;
            }
            playerHit(random);
        }

        mapObject.removeMob(valueX, valueY);
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
        random = 1;
        if (playerObject.blueBit)
        {
            random = Math.floor(Math.random() * 7);
        }

        if (random === 0)
        {
            newMessage("7 hisses as you just barely dodge its attack!");
        }
        else if (phaseBuff())
        {
        }
        else
        {
            if (playerObject.hasShield)
            {
                newMessage("Your shield partially blocks 7s attack!");
                playerObject.blockRecently = 15;
                random = Math.floor(Math.random() * 52) + 49;
                random -= (4 * playerObject.shieldCount)
                playerHit(random);
            }
            else
            {
                newMessage("7 touches base with you.");
                gameOver("7 8 u  :(");
                result = -1;
            }
        }
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
        //TODO: need to constantly 'refresh' canvas
        //ie clearRect and then draw whatever n times per sec
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(pic, 0, 0, SMILESTARTSIZE, SMILESTARTSIZE);
        smileCurSize = SMILESTARTSIZE;
        if (messageQueue[0] === message || messageQueue[1] === message)
        {
        }
        else
        {
            newMessage(message);
        }
        playerObject.armour = 16;
    }
    else if (value === 10)
    {
        tmiss_sound.eat();
        newMessage("You devour a curious looking mushroom.");
        playerObject.score += 4;
        map[valueY][valueX] = 0;
        if (playerObject.greenBit)
        {
            life += 12;
        }
        else
        {
            life += 8;
        }
    }
    else if (value === 13)
    {
        //reserved
    }
    else if (value === 16 || value === 17)
    {
        yShift = (Math.floor(Math.random() * 16) + 16);
        newMessage("You are drawn into the event horizon.");
        if (value === 16)
        {
            yLimit = mapObject.height - 1;
            newY = playerObject.yPos + yShift;
            if (newY > yLimit)
            {
                newY = yLimit;
            }
        }
        else
        {
            newY = playerObject.yPos - yShift;
            if (newY < 0)
            {
                newY = 0;
            }
        }

        playerTeleport(playerObject.xPos, newY);
        tmiss_sound.magic();
    }
    else if (value === 18)
    {
        tmiss_sound.eat();
        newMessage("You snatch up the crystal and swallow it whole!");
        map[valueY][valueX] = 0;
        life += 16;
        timer += 16;
    }
    else if (value === 19)
    {
        map[valueY][valueX] = 0;
        playerObject.score += 150;
        if (!playerObject.hasShield)
        {
            newMessage("You find an old, tarnished metal shield.");
            playerObject.hasShield = true;
        }
        else
        {
            newMessage("Your shield wobbles merrily and merges with its friend!");
            playerObject.shieldCount += 1;
        }
    }
    else if (value === 20)
    {
        map[valueY][valueX] = 0;
        playerObject.score += 150;
        if (!playerObject.hasPick)
        {
            newMessage("You find an old, tarnished metal pick.");
            playerObject.hasPick = true;
            playerObject.pickCount = 1;
        }
        else
        {
            newMessage("Your pick wobbles merrily and merges with its friend!");
            playerObject.pickCount += 1;
        }
    }
    else if (value === 103)
    {
        random = 1;
        if (playerObject.blueBit)
        {
            random = Math.floor(Math.random() * 3);
        }

        if (random === 0)
        {
            newMessage("You just barely evade 3's attack!");
        }
        else
        {
            random = Math.floor(Math.random() * 6);
            if (playerObject.hasShield && random === 0)
            {
                newMessage("You manage to block 3's attack!");
                playerObject.blockRecently = 15;
            }
            else
            {
                newMessage("3's fangs tear off a chunk of your flesh!");
                playerHit(Math.floor(Math.random() * 9) + 3);
            }

            if (life > 0 && playerObject.greenBit)
            {
                random = Math.floor(Math.random() * 3);
                if (random === 0)
                {
                    playerObject.score += 100;
                    newMessage("You grab the 3 and hurl it into the distance!");
                    clobberTile(valueX, valueY);
                }
                else
                {
                    newMessage("3 chomps on your hand as you reach for it!");
                }

            }
        }
    }
    else if (value === 300)
    {
        tmiss_sound.eat();
        newMessage("You devour an aulluring looking mushroom.");
        life += 4;
        map[valueY][valueX] = 0;
        if (playerObject.blueBit)
        {
            timer += 32;
        }
        else
        {
            newMessage("You feel much lighter!");
            colourPlayer("b");
        }
    }
    else if (value === 301)
    {
        tmiss_sound.eat();
        newMessage("You devour a scary looking mushroom.");
        life += 4;
        if (playerObject.pinkBit)
        {
            timer += 32;
        }
        else
        {
            newMessage("You feel much angrier!");
            colourPlayer("p");
        }
        map[valueY][valueX] = 0;
    }
    else if (value === 302)
    {
        tmiss_sound.eat();
        newMessage("You devour a muscular looking mushroom.");
        life += 4;
        if (playerObject.greenBit)
        {
            timer += 32;
        }
        else
        {
            newMessage("You feel like you live in a world made of cardboard!");
            colourPlayer("g");
        }
        map[valueY][valueX] = 0;
    }

    if (life < 1)
    {
        result = -1;
    }

    return result;
}

function playerTeleport(newX, newY)
{
    map[playerObject.yPos][playerObject.xPos] = 0;
    playerObject.xPos = newX;
    playerObject.yPos = newY;
    if (map[newY][newX] != 0)
    {
        newMessage("Something explodes into many wet chunks.");
    }
    map[newY][newX] = 1;
    playerPhase();
}

function rng(value)
{
    return Math.floor(Math.random() * value);
}

function mineTile(xPos, yPos)
{
    newMessage("The wall blows apart from your onslaught!");
    map[yPos][xPos] = 0;
    pickStrength = playerObject.pickCount;
    random = rng(pickStrength * 32);
    if (random === 0)
    {
        newMessage("Your pick breaks into pieces!");
        playerObject.wielded = "nothing";
        playerObject.hasPick = false;
        playerObject.pickCount = 0;
    }
}

function playerBump(value, valueX, valueY, offsetX, offsetY)
{
    var i;
    var j;
    var random;
    var timeOut;

    var pick;
    var pickCount;
    var blue;
    var pink;
    var green;
    var wallTile;

    blue = playerObject.blueBit;
    pink = playerObject.pinkBit;
    green = playerObject.greenBit;
    pick = (playerObject.wielded === "pick");
    wallTile = (value === 12);

    if (wallTile && (!green || pick))
    {
        if (!pick)
        {
            newMessage("You huff and you puff but the wall remains.");
        }
        else
        {
            mineTile(valueX, valueY);
        }
    }
    else if (value === 14 && pink)
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
    else if (value === 15 && pink)
    {
        newMessage("You execute your best flying dropkick!");
        bootItem(valueX, valueY, offsetX, offsetY, 3);
    }
    else if ((wallTile || value === 14) && green)
    {
        if (map[valueY + offsetY][valueX + offsetX] === 0)
        {
            newMessage("You put your back into it!");
            map[valueY + offsetY][valueX + offsetX] = map[valueY][valueX];
            map[valueY][valueX] = 0;
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
//TODO bug
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

        if (travel > 0)
        {
            bootItem(newX, newY, offsetX, offsetY, travel - 1);
        }
    }
}

function phaseBuff()
{
    var result;

    result = false;

    if (playerObject.phasing)
    {
        newMessage("Your phase-state protects you from attack!");
        result = true;
    }
    else
    {
        result = false;
    }

    return result;
}

function canvasPaint()
{
    context.clearRect(0, 0, canvas.width, canvas.height);

    tmiss_draw.paintCanvas(mapObject, playerObject, context);

    if (playerObject.armour > 0)
    {
        while (playerObject.armourReduction > 0)
        {
            smileCurSize = smileCurSize - smileReduction;
            playerObject.armourReduction -= 1;
        }

        context.drawImage(pic, 0, 0, smileCurSize, smileCurSize);
    }

    if (playerObject.blockRecently > 0)
    {
        playerObject.blockRecently -= 1;
        context.drawImage(block_pic, (canvas.width/2 - 75), (canvas.height/2 - 70), SMILESTARTSIZE - 10, SMILESTARTSIZE - 10);
    }

    if (playerObject.hitRecently > 0)
    {
        playerObject.hitRecently -= 1;
        context.drawImage(scratch_pic, (canvas.width/2 - 75), (canvas.height/2 - 70), SMILESTARTSIZE, SMILESTARTSIZE);
    }

    timerPaint = setTimeout(canvasPaint, 25);
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
        playerObject.armourReduction += 1;
        if (playerObject.armour === 0)
        {
            newMessage("You are suddenly not so hard anymore...");
            playerObject.armourReduction = 0;
        }
    }

    return result;
}

function playerPhase()
{
    clearTimeout(timerPlayerPhasing);
    timerPlayerPhasing = setTimeout(function(){playerPhasing()}, 2000);
    playerObject.phasing = true;
    flashOn(2000);
}

function playerPhasing()
{
    playerObject.phasing = false;
    newMessage("You fully phase into existence.");
}

function playerHit(damage)
{
    if (!armourBuff() && !phaseBuff())
    {
        if (damage > 0)
        {
            life -= damage;
            flashOn(200);
        }
        else
        {
            newMessage("You take no damage.");
        }
    }
    if (playerObject.hitRecently < 1)
    {
        playerObject.hitRecently = 10;
    }
}

function flashOn(millisecs)
{
    clearTimeout(timerPlayerFlash);
    timerPlayerFlash = setTimeout(function(){playerFlash(10)}, millisecs);
    playerObject.flashBit = true;
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
    score = playerObject.score
    score += (timer * 10);
    score += life;
    if (difficulty === "easy")
    {
        score = score / 2;
    }
    else if (difficulty === "hard")
    {
        score = score * 3;
    }

    score = Math.floor(score);

    grade = "?";
    if (score < 500)
        grade = "F";
    else if (score < 550)
        grade = "D";
    else if (score < 600)
        grade = "C";
    else if (score < 650)
        grade = "C+";
    else if (score < 700)
        grade = "B";
    else if (score < 750)
        grade = "B+";
    else if (score < 800)
        grade = "A";
    else
        grade = "A+";

    window.alert("Good job!\nDifficulty: " + difficulty + "\nTotal score: " + score + "\nFinal grade: " + grade);
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
    var position;

    //just in case player was ninja'd:
    quickUpdate();

    tmiss_sound.death();
    playerObject.alive = false;
    endGame();
    window.alert("Game Over: " + message + "\n" + "Difficulty: " + difficulty);
}

function endGame()
{
    var i;
    var j;
    var array;

    array = mapObject.boomAlert;

    for (i = 0; i < array.length; i++)
       if (array[i])
            for (j = 0; j < array[i].length; j++)
                clearTimeout(array[i][j]);

    array = mapObject.fireAlert;

    for (i = 0; i < array.length; i++)
        if (array[i])
            for (j = 0; j < array[i].length; j++)
                clearTimeout(array[i][j]);

    context.clearRect(0, 0, canvas.width, canvas.height);

    clearTimeouts();
    setTimeout(startGame, 1000);
}

function clearTimeouts()
{
    clearTimeout(timerPlayerPhasing);
    clearTimeout(timerPlayerFlash);
    clearTimeout(timerHeart);
    clearTimeout(timerExist);
    clearTimeout(timerMoveMob);
    clearTimeout(timerDraw);
    clearTimeout(timerInteractions);
    clearTimeout(timerMushroom);
    clearTimeout(timerPlayerFlash);
    clearTimeout(timerMovePlayer);
}

function doIExist()
{
    var value;

    value = map[playerObject.yPos][playerObject.xPos];
    if (value != 1)
    {
        newMessage("Overwritten by: " + value);
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

    //TODO hacky
    if (map[mapObject.height - 2][mapObject.width - 2] != 2)
    {
        mapObject.removeMob(mapObject.width - 2, mapObject.height - 2);
        map[mapObject.height - 2][mapObject.width - 2] = 2;
    }

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

    pane = document.getElementById("bottom");
    pane.innerHTML = "";

    pane.innerHTML += '<font size="6" color="green">' + "Life: " + life + "</font>&emsp;";
    pane.innerHTML += '<font size="6" color="red">' + "Time: " + timer + "</font>&emsp;";
    pane.innerHTML += '<font size="6" color="blue">' + "Score: " + playerObject.score + "</font>&emsp;";
    pane.innerHTML += '<font size="6" color="yellow">' + "position: " + Math.floor(playerObject.yPos / mapObject.height * 100) + "%</font>";
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

function newMap()
{
    mapObject = tmiss_generate.map(difficulty);

    map = mapObject.mapArray;

    mapObject.boomAlert = [];
    mapObject.fireAlert = [];
}

function newGame()
{
    playerObject.xPos = 0;
    playerObject.yPos = 0;
    playerObject.alive = true;
    playerObject.flashBit = false;
    playerObject.armour = 0;
    playerObject.score = 1;
    playerObject.hasShield = false;
    playerObject.shieldCount = 0;
    playerObject.hasPick = false;
    playerObject.pickCount = 0;
    playerObject.wielded = "nothing";
    playerObject.powerMove = false;
    playerObject.hitRecently = 0;
    playerObject.blockRecently = 0;
    playerObject.armourReduction = 0;

    currentKeys = [];

    currentRoundCount += 1;

    newMap();

    messageQueue = [];
    for (var i = 0; i < MESSAGE_QUEUE_MAX; i++)
    {
        newMessage("");
    }

    newMessage("Type \"h\" for help <---------------");

    newMessage('<font color="' + "lime" + '">Objective: Locate the '+ '</font><font color="' + COLOR_PINK + '">*</font>');

    life = 128;
    timer = 1024;
    timerBit = false;
}

function colourPlayer(colour)
{
    playerObject.blueBit = false;
    playerObject.pinkBit = false;
    playerObject.greenBit = false;

    if (colour === "b")
    {
        playerObject.blueBit = true;
        playerObject.colour = "#00FFFF";
    }
    else if (colour === "p")
    {
        playerObject.pinkBit = true;
        playerObject.colour = COLOR_PINK;
    }
    else if (colour === "g")
    {
        playerObject.greenBit = true;
        playerObject.colour = "#00FF00";
    }
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

        input = window.prompt("Select Player: (type b for blue or p for pink or g for green or h for help)", preset);
        if (input === "b" || input === "p" || input === "g")
        {
            colourPlayer(input);
            done = true;
        }
        else if (input === "h")
        {
            tmiss_help.menu();
        }
        else if (input === "easy" || input === "hard" || input === "normal")
        {
            difficulty = input;
            alert("Difficulty set to " + difficulty);
            newMap(input);
        }
    }

    timerHeart = setTimeout(heartBeat, 500);
    timerExist = setTimeout(doIExist, 50);
    timerMoveMob = setTimeout(moveRandomMob, 25);
    timerDraw = setTimeout(drawMap, 25);
    timerInteractions = setTimeout(playerInteractions, 25);
    timerMushroom = setTimeout(randomMush, 30);
    timerPaint = setTimeout(canvasPaint, 25);

    playerPhase();
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

var pic;
pic = new Image();
pic.src = "res/no_idea.png";
pic.onload = function()
{
}

var block_pic;
block_pic = new Image();
block_pic.src = "res/block.png";
block_pic.onload = function()
{
}

var scratch_pic;
scratch_pic = new Image();
scratch_pic.src = "res/scratch.png";
scratch_pic.onload = function()
{
}


context.fillStyle = "rgb(200,100,50)";

context.strokeStyle="#FF0000";
//context.strokeRect(50,50,500,50);

context.canvas.addEventListener('mousedown', function(event)
{
    var xPos;
    var yPos;

    xPos = playerObject.xPos;
    yPos = playerObject.yPos;

    event.preventDefault();//TODO
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
