let canvas;

let sprites = {
    leftBranch: null,
    rightBranch: null,
    cat: null,
};
Object.keys(sprites).forEach((key) => {
    sprites[key] = new Image(400, 400);
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
        context.drawImage(drawSprite, x, y, canvas.width * scale, canvas.height * scale);
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
        drawSprite(context, canvas.width / 4, convertCoord(y), "leftBranch", 0.2);
    } else {
        drawSprite(context, 3 * canvas.width / 4, convertCoord(y), "rightBranch", 0.2);
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
    context.fillStyle = "green";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // draw current 6 branches on screen
    if (drawState.players[pid]) {
        for (let b = 0; b < 6; b++) {
            let player = drawState.players[pid];
            console.log(drawState);
            console.log(player.index);
            const branch = player.index + b - 1;
            drawBranch(context, b * canvas.height / 8, drawState.branches[branch]);
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
        drawPlayer(context, x, 100, p.avatar);
    });
};
