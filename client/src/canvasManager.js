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

const drawPlayer = (context, x, y, animal) => {
    drawSprite(context, x, convertCoord(y), animal, 0.1);
};

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

    // clear the canvas to green
    // context.fillStyle = "green";
    // context.fillRect(0, 0, canvas.width, canvas.height);

    // draw tree trunk
    context.fillStyle = "#a05b2d";
    context.fillRect(7 * canvas.width / 16, 0, canvas.width / 8, canvas.height);

    // draw current 6 branches on screen
    if (drawState.players[pid]) {
        for (let b = 0; b < 6; b++) {
            let player = drawState.players[pid];
            const branch = player.index + b;
            drawBranch(context, (b + 0.5) * canvas.height / 7, drawState.branches[branch]);
        }
    }

    // draw all the players
    Object.values(drawState.players).forEach((p) => {
        let x;
        if (p.position.x === "left") {
            x = canvas.width / 4;
        } else {
            x = 3 * canvas.width / 4;
        }
        drawPlayer(context, x, canvas.height / 8, p.avatar);
    });
};
