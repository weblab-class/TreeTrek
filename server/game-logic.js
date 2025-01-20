/** constants */
const MAP_LENGTH = 500;
const PLAYER_HEIGHT = 100;
const ACORN_SIZE = 2;
const ACORN_PROB = 0.2;
const avatars = ["scratch", "beaver"];

/** Utils! */

/** Helper to generate a random integer */
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};