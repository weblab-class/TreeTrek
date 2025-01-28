let canvas;

let sprites = {
    leftBranch: null,
    rightBranch: null,
    bearleft: null,
    bearright: null,
    birdleft: null,
    birdright: null,
    chickenleft: null,
    chickenright: null,
    deerleft: null,
    deerright: null,
    dogleft: null,
    dogright: null,
    duckleft: null,
    duckright: null,
    foxleft: null,
    foxright: null,
    hedgehogleft: null,
    hedgehogright: null,
    horseleft: null,
    horseright: null,
    lionleft: null,
    lionright: null,
    mouseleft: null,
    mouseright: null,
    pandaleft: null,
    pandaright: null,
    penguinleft: null,
    penguinright: null,
    rabbitleft: null,
    rabbitright: null,
    skunkleft: null,
    skunkright: null,
    squirrelleft: null,
    squirrelright: null,
    tigerleft: null,
    tigerright: null,
    timleft: null,
    timright: null,
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
    scale,
    orient
    ) => {
    const drawSprite = sprites[sprite];
    if (drawSprite.complete && drawSprite.naturalHeight !== 0) {
        let scaledHeight = canvas.height * scale;
        let scaledWidth = drawSprite.naturalWidth * scaledHeight / drawSprite.naturalHeight;
        let drawX;
        if (orient === "left") {
            drawX = x;
        } else if (orient === "center") {
            drawX = x - scaledWidth / 2
        } else if (orient === "right") {
            drawX = x - scaledWidth;
        }
        let drawY = y - scaledHeight / 2;
        context.drawImage(drawSprite, drawX, drawY, scaledWidth, scaledHeight);
    } else {
        console.error(`Sprite ${sprite} is not loaded yet.`);
    }
};

/** drawing functions */

const drawBranch = (context, y, dir) => {
    if (dir === "left") {
        drawSprite(context, 15 * canvas.width / 32, y, "leftBranch", 0.15, "right");
    } else {
        drawSprite(context, 17 * canvas.width / 32, y, "rightBranch", 0.15, "left");
    };
};

export const drawCanvas = (drawState, canvasRef, pid) => {
    // use canvas reference of canvas element to get reference to canvas object
    canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // draw tree trunk
    context.fillStyle = "#a05b2d";
    context.fillRect(15 * canvas.width / 32, 0, canvas.width / 16, canvas.height);

    // draw current 6 branches on screen
    if (drawState.players[pid]) {
        for (let b = 0; b < 6; b++) {
            let player = drawState.players[pid];
            drawBranch(context, convertCoord((b + 0.5) * canvas.height / 7), drawState.branches[player.index + b]);
        }
    }
};

const animatedPlayerSpecs = (player, bottomIndex, branchSpacing) => {
    let specs = {
        y: (player.index - bottomIndex) * branchSpacing,
        scale: 0,
    }

    if (player.animation <= 5) {
        specs.y += branchSpacing * 0.1 * player.animation;
        specs.scale = 0.002 * player.animation;
    } else { // shouldnt happen
        specs.y = 0;
        specs.scale = 0;
    }

    return specs;
}

export const drawPlayer = (player, canvasRef) => {
    // use canvas reference of canvas element to get reference to canvas object
    canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight;

    let x;
    if (player.xPosition === "left") {
        x = canvas.width / 4;
    } else {
        x = 3 * canvas.width / 4;
    }
    let { y, scale } = animatedPlayerSpecs(player, player.index, canvas.height / 7);
    drawSprite(context, x, convertCoord(0.9 * canvas.height / 7 + y), player.avatar + `${player.xPosition}`, 0.1 + scale, "center");
};
