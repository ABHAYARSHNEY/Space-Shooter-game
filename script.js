const gameContainer = document.getElementById("game-container");
const spaceship = document.getElementById("spaceship");
const scoreDisplay = document.getElementById("score");

let score = 0;
let gameInterval;

let spaceshipPosition = gameContainer.offsetWidth / 2 - spaceship.offsetWidth / 2;
spaceship.style.left = `${spaceshipPosition}px`;

// Arrow key control
document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") moveLeft();
    else if (event.code === "ArrowRight") moveRight();
    else if (event.code === "Space") shootLaser();
});

// Touch buttons
document.getElementById("left-btn").addEventListener("click", moveLeft);
document.getElementById("right-btn").addEventListener("click", moveRight);
document.getElementById("shoot-btn").addEventListener("click", shootLaser);

function moveLeft() {
    if (spaceshipPosition > 0) {
        spaceshipPosition -= 20;
        spaceship.style.left = spaceshipPosition + "px";
    }
}

function moveRight() {
    if (spaceshipPosition < gameContainer.offsetWidth - spaceship.offsetWidth) {
        spaceshipPosition += 20;
        spaceship.style.left = spaceshipPosition + "px";
    }
}

// Function to shoot lasers
function shootLaser() {
    const laser = document.createElement("div");
    laser.classList.add("laser");
    laser.style.left = spaceshipPosition + 20 + "px";
    laser.style.bottom = "70px";
    gameContainer.appendChild(laser);

    const laserInterval = setInterval(() => {
        const laserBottom = parseInt(window.getComputedStyle(laser).bottom);
        if (laserBottom >= 800) {
            laser.remove();
            clearInterval(laserInterval);
        } else {
            laser.style.bottom = laserBottom + 15 + "px";
            checkLaserCollision(laser, laserInterval);
        }
    }, 20);
}


// Asteroids
function spawnAsteroid() {
    const asteroid = document.createElement("div");
    asteroid.classList.add("asteroid");
    asteroid.style.left = Math.floor(Math.random() * (gameContainer.offsetWidth - 40)) + "px";
    asteroid.style.top = "-40px";
    gameContainer.appendChild(asteroid);

    const asteroidInterval = setInterval(() => {
        const asteroidTop = parseInt(window.getComputedStyle(asteroid).top);
        if (asteroidTop >= gameContainer.offsetHeight) {
            asteroid.remove();
            clearInterval(asteroidInterval);
        } else {
            asteroid.style.top = asteroidTop + 4 + "px";
            checkGameOver(asteroid, asteroidInterval);
        }
    }, 50);
}

function checkLaserCollision(laser, laserInterval) {
    const laserRect = laser.getBoundingClientRect();
    const asteroids = document.querySelectorAll(".asteroid");

    asteroids.forEach((asteroid) => {
        const asteroidRect = asteroid.getBoundingClientRect();

        if (
            laserRect.left < asteroidRect.right &&
            laserRect.right > asteroidRect.left &&
            laserRect.top < asteroidRect.bottom &&
            laserRect.bottom > asteroidRect.top
        ) {
            asteroid.remove();
            laser.remove();
            clearInterval(laserInterval);
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
        }
    });
}

function checkGameOver(asteroid, asteroidInterval) {
    const asteroidRect = asteroid.getBoundingClientRect();
    const spaceshipRect = spaceship.getBoundingClientRect();

    if (
        asteroidRect.left < spaceshipRect.right &&
        asteroidRect.right > spaceshipRect.left &&
        asteroidRect.top < spaceshipRect.bottom &&
        asteroidRect.bottom > spaceshipRect.top
    ) {
        clearInterval(gameInterval);
        clearInterval(asteroidInterval);
        alert(`Game Over! Final Score: ${score}`);
        window.location.reload();
    }
}

function startGame() {
    gameInterval = setInterval(spawnAsteroid, 1000);
}

startGame();
