let trun_anim = {

// "const"
CANVAS_WIDTH: 512,
CANVAS_HEIGHT: 512,
DRAW_MAP_WIDTH_AND_HEIGHT: 16,
PLAYER_X: 8,
PLAYER_Y: 8,
PLAYER_X_INNER_PIXEL: (512 / 16) * 8 + (512 / 16 / 2),
PLAYER_Y_INNER_PIXEL: (512 / 16) * 8 + (512 / 16 / 2),
PROJECTILE_SPEED: 4,

// var

// function

newInboundProjectile: function (playerPosition, origin) {
    let offX = playerPosition[0] - origin[0];
    let offY = playerPosition[1] - origin[1];

    let originRelativeX = this.PLAYER_X - offX;
    let originRelativeY = this.PLAYER_Y - offY;

    let canvasOrigin = this.tileToInnerPixels(originRelativeX, originRelativeY);
    let canvasDestination = [];
    canvasDestination[0] = this.PLAYER_X_INNER_PIXEL;
    canvasDestination[1] = this.PLAYER_Y_INNER_PIXEL;

    return this.buildProjectile(canvasOrigin, canvasDestination);
},

moveProjectile: function (proj) {
    let cx = proj.currX;
    let cy = proj.currY;
    let dx = proj.destX;
    let dy = proj.destY;
    let ps = proj.speed;

    if (cx < dx) {
        for (let i = 0;cx < dx && i < ps; i++) {
            cx += 1;
        }
    } else if (cx > dx) {
        for (let i = 0;cx > dx && i < ps; i++) {
            cx -= 1;
        }
    }

    if (cy < dy) {
        for (let i = 0;cy < dy && i < ps; i++) {
            cy += 1;
        }
    } else if (cy > dy) {
        for (let i = 0;cy > dy && i < ps; i++) {
            cy -= 1;
        }
    }

    proj.currX = cx;
    proj.currY = cy; //TODO complete?

    if (cx === dx && cy === dy) {
        proj.alive = false;
    }
},

buildProjectile: function (origin, destination) {
    let proj = {};
    proj.currX = origin[0];
    proj.currY = origin[1];
    proj.destX = destination[0];
    proj.destY = destination[1];
    proj.speed = 16;
    proj.alive = true;

    return proj;
},

tileToInnerPixels: function (tileX, tileY) {
    let pixelXCount = this.CANVAS_WIDTH;
    let pixelYCount = this.CANVAS_HEIGHT;
    let pxc = pixelXCount;
    let pyc = pixelYCount;

    let tileWidth = pxc / this.DRAW_MAP_WIDTH_AND_HEIGHT; // 512 / 16 = 32
    let tileHeight = pyc / this.DRAW_MAP_WIDTH_AND_HEIGHT; // 512 / 16 = 32
    let tw = tileWidth;
    let th = tileHeight;

    let xy = [];
    xy[0] = tileX * tw + (tw / 2);
    xy[1] = tileY * th + (th / 2);

    return xy;
}

} // trun_anim
