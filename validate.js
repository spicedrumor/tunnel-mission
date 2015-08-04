var tmiss_validate = {


validTile: function(newX, newY, mapObject)
{
    var result;
    var notTooSmall;
    var notTooBig;
    var mapWidth;
    var mapHeight;

    mapWidth = mapObject.mapArray[0].length;
    mapHeight = mapObject.mapArray.length;

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

};
