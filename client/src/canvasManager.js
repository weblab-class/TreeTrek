let canvas;

let sprites = {
    leftBranch: null,
    rightBranch: null,
    cat: null,
};
Object.keys(sprites).forEach((key) => {
    sprites[key] = new Image();
    sprites[key].src = `/${key}.png`;
});

// converts a coordinate in a normal X Y plane to canvas coordinates
const convertCoord = (y) => {
    if (!canvas) return;
    return  canvas.height - y;
};

const drawSprite = (
    context,
    x,
    y,
    sprite,
    scale
    ) => {
    const drawSprite = sprites[sprite];
    if (drawSprite.complete && drawSprite.naturalHeight !== 0) {
        let scaledHeight = canvas.height * scale;
        let scaledWidth = drawSprite.naturalWidth * scaledHeight / drawSprite.naturalHeight;
        let drawX = x - scaledWidth / 2;
        let drawY = y - scaledHeight / 2;
        context.drawImage(drawSprite, drawX, drawY, scaledWidth, scaledHeight);
    } else {
        console.error(`Sprite ${sprite} is not loaded yet.`);
    }
};

/** drawing functions */

const drawBranch = (context, y, dir) => {
    if (dir === "left") {
        drawSprite(context, canvas.width / 4, convertCoord(y), "leftBranch", 0.15);
    } else {
        drawSprite(context, 3 * canvas.width / 4, convertCoord(y), "rightBranch", 0.15);
    };
};

export const drawCanvas = (drawState, canvasRef, pid) => {
    // use canvas reference of canvas element to get reference to canvas object
    canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight;

    // draw tree trunk
    context.fillStyle = "#a05b2d";
    context.fillRect(7 * canvas.width / 16, 0, canvas.width / 8, canvas.height);

    // draw current 6 branches on screen
    if (drawState.players[pid]) {
        for (let b = 0; b < 6; b++) {
            let player = drawState.players[pid];
            drawBranch(context, (b + 0.5) * canvas.height / 7, drawState.branches[player.index + b]);
        }
    }

    // draw all the players
    // const player =
    // Object.values(drawState.players).forEach((p) => {
    //     let x;
    //     if (p.xPosition === "left") {
    //         x = canvas.width / 4;
    //     } else {
    //         x = 3 * canvas.width / 4;
    //     }
    //     drawPlayer(context, x, canvas.height / 8, p.avatar);
    // });
};

export const drawPlayer = (player, canvasRef) => {
    console.log("drewplayer2");
    // use canvas reference of canvas element to get reference to canvas object
    canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight;
    console.log("made canvas");

    let x;
    if (player.xPosition === "left") {
        x = canvas.width / 4;
    } else {
        x = 3 * canvas.width / 4;
    }
    drawSprite(context, x, convertCoord(canvas.height / 8), player.avatar, 0.1);
    //context.clearRect(0, 0, canvas.width, canvas.height);
    //drawSprite(context, x, convertCoord(canvas.height / 8), player.avatar, 0.3);
    console.log("drew player " + player);
};
