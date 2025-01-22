let canvas;

let sprites = {
    cat: null,
};
Object.keys(sprites).forEach((key) => {
    sprites[key] = new Image(400, 400);
    sprites[key].src = `/player-avatars/${key}.png`;
});

// converts a coordinate in a normal X Y plane to canvas coordinates
const convertCoord = (x, y) => {
    if (!canvas) return;
    return {
      drawX: x,
      drawY: canvas.height - y,
    };
  };

const drawSprite = (
    context,
    x,
    y,
    animal
    ) => {
    const sprite = sprites[animal];
    if (sprite.complete && sprite.naturalHeight !== 0) {
        context.save();
        context.drawImage(sprite, x, y, canvas.height * 0.1, canvas.height * 0.1);
        context.restore();
    } else {
        console.error(`Sprite ${animal} is not loaded yet.`);
    }
};

/** drawing functions */

const drawPlayer = (context, x, y, animal) => {
    const { drawX, drawY } = convertCoord(x, y);
    drawSprite(context, drawX, drawY, animal);
};

export const drawCanvas = (drawState, canvasRef) => {
    // use canvas reference of canvas element to get reference to canvas object
    canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth/2;
    canvas.height = window.innerHeight - 100;

    // clear the canvas to black
    context.fillStyle = "green";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // draw all the players
    Object.values(drawState.players).forEach((p) => {
        drawPlayer(context, p.position.x, p.position.y, p.avatar);
    });
};
