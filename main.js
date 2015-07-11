/*
TODO

*/
(function TMGame ()
{

var MESSAGE_QUEUE_MAX = 8;
var HIT_SOUND_FILENAME = "res/augh.wav";
var DEATH_SOUND_FILENAME = "res/death.wav";
var WIN_SOUND_FILENAME = "res/woohoo.wav";
var EAT_SOUND_FILENAME = "res/omnom.wav";
var EXPLODE_SOUND_FILENAME = "res/explosion.wav";
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
var mobList;
var timerHeart;
var timerExist;
var timerMoveMob;
var timerDraw;
var timerInteractions;
var currentRoundCount;

currentRoundCount = 0;
blueBit = true;

hitSound = new Audio(HIT_SOUND_FILENAME);
deathSound = new Audio(DEATH_SOUND_FILENAME);
winSound = new Audio(WIN_SOUND_FILENAME);
eatSound = new Audio(EAT_SOUND_FILENAME);
explodeSound = new Audio(EXPLODE_SOUND_FILENAME);

directions = ["n", "s", "e", "w"];

function generateMap()
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
    return (map[tileY][tileX] == 0);
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

function moveRandomMob()
{
    var randomX;
    var randomY;
    var randomDirection;
    var mover;
    var destination;

    randomX = Math.floor(Math.random() * map[0].length);
    randomY = Math.floor(Math.random() * map.length);
    
    randomDirection = directions[Math.floor(Math.random() * 4)];
    
    mover = map[randomY][randomX];
    if (mover > 2 && mover < 10) 
    {
        if (mover != 7)
        {
            move(randomDirection, randomX, randomY, mover);
        }
        else
        {
            destination = move(randomDirection, randomX, randomY, mover);
            move(randomDirection, destination[0], destination[1], mover);
        }
    }

    timerMoveMob = setTimeout(moveRandomMob, 25);
}

function move(direction, originX, originY, value)
{
    var result;
    var offsetX;
    var offsetY;
    var newX;
    var newY;
    
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
        map[originY][originX] = 0;
        map[newY][newX] = value;
        result[0] = newX;
        result[1] = newY;
    }
    else
    {
    }

    return result;
}

document.onkeyup = function(e)
{
    var direction;
    var newCoords;
    var key = e.keyCode ? e.keyCode : e.which;
                
    direction = "";
    if (key == KEY_CODE_W)
    {
        direction = "n";
    }
    else if (key == KEY_CODE_D)
    {
        direction = "e";
    }
    else if (key == KEY_CODE_S)
    {
        direction = "s";
    }
    else if (key == KEY_CODE_A)
    {
        direction = "w";
    }

    if (direction === "")
    {
    }
    else
    {
        newCoords = move(direction, xPos, yPos, MAP_VAL_PLAYER);
        xPos = newCoords[0];
        yPos = newCoords[1];
    }
}

function mapToString(map)
{
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

function drawMap()
{
    mapString = mapToString(map);
    document.getElementById("left").innerHTML = mapString;
    timerDraw = setTimeout(drawMap, 25);
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

            if (rc == -1)
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
    var result;

    result = 0;

    if (value == 2)
    {
        winSound.play();
        window.alert("You win! Good job!");
        endGame();
    }
    else if (value == 3)
    {
        random = 1;
        if (blueBit)
        {
            random = Math.floor(Math.random() * 5);
        }

        if (random != 0)
        {
            hitSound.play();
            newMessage("3 bites you with glee!");
            life -= 1;
        }
        else
        {
            newMessage("You narrowly evade 3's attack!");
        }
    }
    else if (value == 4)
    {
        newMessage("4 propagates.");
        if (safeTile(0, 0))
        {
            map[0][0] = 4;
        }
        if (safeTile(mapWidth - 1, 0))
        {
            map[0][mapWidth - 1] = 4;
        }
        if (safeTile(0, mapHeight - 1))
        {
            map[mapHeight - 1][0] = 4;
        }
        if (safeTile(mapWidth - 1, mapHeight - 1))
        {
            map[mapHeight - 1][mapWidth - 1] = 4;
        }
    }
    else if (value == 5)
    {
        random = 1;
        if (blueBit)
        {
            random = Math.floor(Math.random() * 5);
        }
        if (random != 0)
        {
            hitSound.play();
            newMessage("5 smacks you around like a rag doll!");
            random = Math.floor(Math.random() * 21) + 5;
            life -= random;
            map[valueY][valueX] = 0;
        }
        else
        {
            newMessage("You narrowly evade 5's attack!");
        }
    }
    else if (value == 6)
    {
        newMessage("6 whistles a funeral dirge.");
        i = 0;

        while (i < 6)
        {
            random = randomTile();
            if (safeTile(random[0], random[1]))
            {
                map[random[1]][random[0]] = 7;
                i += 1;
            }
        }
        map[valueY][valueX] = 0;
    }
    else if (value == 8)
    {
        newMessage("8 grins mischievously.");
    }
    else if (value == 7)
    {
        gameOver("7 8 u  :(");
        result = -1;
    }
    else if (value == 10)
    {
        eatSound.play();
        newMessage("You devour a curious looking mushroom.");
        map[valueY][valueX] = 0;
        life += 6;
    }    
    else if (value == 13)
    {
        //reserved
    }
    else if (value == 14)
    {
        if (!blueBit)
        {
            newMessage("You light the fuse...");
            map[valueY][valueX] = 15;
            setTimeout(function(){explosion(valueX, valueY, currentRoundCount)}, 5000);
        }
    }    

    return result;
}

function explosion(bombX, bombY, roundCount)
{
    var output;
    
    if (roundCount != currentRoundCount)
    {
        return;
    }

    output = 12;

    newMessage("Giant explosion!");
    explodeSound.play();
    map[bombY][bombX] = 0;
    if (validTile(bombX, bombY - 1))
    {
        map[bombY - 1][bombX] = output;
        if (validTile(bombX, bombY - 2))
        {
            map[bombY - 2][bombX] = output;
            if (validTile(bombX, bombY - 3))
            {
                map[bombY - 3][bombX] = output;
            }
        }
    }
    if (validTile(bombX + 1, bombY))
    {
        map[bombY][bombX + 1] = output;
        if (validTile(bombX + 2, bombY))
        {
            map[bombY][bombX + 2] = output;
            if (validTile(bombX + 3, bombY))
            {
                map[bombY][bombX + 3] = output;
            }
        }
    }
    if (validTile(bombX, bombY + 1))
    {
        map[bombY + 1][bombX] = output;
        if (validTile(bombX, bombY + 2))
        {
            map[bombY + 2][bombX] = output;
            if (validTile(bombX, bombY + 3))
            {
                map[bombY + 3][bombX] = output;
            }
        }
    }
    if (validTile(bombX - 1, bombY))
    {
        map[bombY][bombX - 1] = output;
        if (validTile(bombX - 2, bombY))
        {
            map[bombY][bombX - 2] = output;
            if (validTile(bombX - 3, bombY))
            {
                map[bombY][bombX - 3] = output;
            }
        }
    }
}

function gameOver(message)
{
    deathSound.play();
    drawMap(); //just in case player was ninja'd
    window.alert("Game Over: " + message);
    endGame();
}

function endGame()
{
    clearTimeout(timerHeart);
    clearTimeout(timerExist);
    clearTimeout(timerMoveMob);
    clearTimeout(timerDraw);
    clearTimeout(timerInteractions);
    startGame();
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

function doIExist()
{
    if (map[yPos][xPos] != 1)
    {
        gameOver("You (violently) ceased to exist.");
    }
    else
    {
    }

    timerExist = setTimeout(doIExist, 50);
}

function heartBeat()
{
    if (life < 1)
    {
        gameOver('You collapsed.');
    }
    if (timer < 1)
    {
        gameOver("You didn't make it in time.");
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
    timerHeart = setTimeout(heartBeat, 500);
}

function updateStatusPane()
{
    var rightPane;
    var i;

    rightPane = document.getElementById("right");
    rightPane.innerHTML = "";
    rightPane.innerHTML += '<font color="green">' + "<h2>Health: " + life + "</h2></font><br>";
    rightPane.innerHTML += '<font color="red">' + "<h2>Time: " + timer + "</h2></font><br>";
    rightPane.innerHTML += '</font>';
    for (i = 0; i < MESSAGE_QUEUE_MAX; i++)
    {
        if (i != 0)
        {
            rightPane.innerHTML += "<h3>" + messageQueue[i] + "</h4>";
        }
        else
        {
            rightPane.innerHTML += "<h2>" + messageQueue[i] + "</h2>";
        }
    }
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

var Blast = function(direction)
{
    this.direction = direction;
};

function newGame()
{
    xPos = 0;
    yPos = 0;

    currentRoundCount += 1;

    map = generateMap();
    mapWidth = map[0].length;
    mapHeight = map.length;

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
        if (blueBit)
        {
            preset = "b";
        }
        else
        {
            preset = "p";
        }

        input = window.prompt("Select Player: (type b for blue or p for pink)", preset);
        if (input === "b")
        {
            blueBit = true;
            done = true;
        }
        else if (input === "p") 
        {
            blueBit = false;
            done = true;
        }
    }
    
    timerHeart = setTimeout(heartBeat, 500);
    timerExist = setTimeout(doIExist, 50);
    timerMoveMob = setTimeout(moveRandomMob, 25);
    timerDraw = setTimeout(drawMap, 25);
    timerInteractions = setTimeout(playerInteractions, 25);
}

startGame();

}());
//601
