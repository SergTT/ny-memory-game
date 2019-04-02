(function() {
    let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
    window.requestAnimationFrame = requestAnimationFrame;
})();

let flakes = [],
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    flakeCount = 250,
    mX = -100,
    mY = -100,
    tree,
    christmasBalls = [],
    currentBall = 0,
    showTime = 180,
    timeIsUp = false,
    animId,
    treeAnimID,
    snowAnimID,
    animDuration,
    timerId,
    level = 1;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

let xMod = (canvas.width - 800) / 2,
    yMod = (canvas.height - 800) / 2;

let dataBalls = [
    {left:362, top:554},
    {left:582, top:524},
    {left:238, top:425},
    {left:394, top:410},
    {left:496, top:346},
    {left:430, top:282},
    {left:332, top:226}
];

function drawText(ballNumber, ballX, ballY) {
    ctx.font = "40px Arial";
    ctx.textBaseline = "top";
    ctx.fillStyle = "white";
    ctx.fillText(ballNumber, ballX, ballY);
}

function showAndHideBallNumbers(animDuration) {
    for (let i = 0; i < showAndHideBallNumbers.level + 1; i += 1) {
        if (christmasBalls[i] && christmasBalls[i].show) {
            drawText(christmasBalls[i].num, christmasBalls[i].left + xMod, christmasBalls[i].top + yMod);
        }
    }
    if (!timeIsUp && !(--showTime)) {
        timeIsUp = true;

        for (let i = 0; i < showAndHideBallNumbers.level + 1; i += 1) {
            christmasBalls[i].show = false;
        }
    }

    animId = requestAnimationFrame(showAndHideBallNumbers);
}

function drawTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tree,xMod,yMod,800,800);
    treeAnimID = requestAnimationFrame(drawTree);
}

function snow() {
    for (let i = 0; i < flakeCount; i++) {
        let flake = flakes[i],
            x = mX,
            y = mY,
            minDist = 150,
            x2 = flake.x,
            y2 = flake.y;

        let dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
            dx = x2 - x,
            dy = y2 - y;

        if (dist < minDist) {
            let force = minDist / (dist * dist),
                xcomp = (x - x2) / dist,
                ycomp = (y - y2) / dist,
                deltaV = force / 2;

            flake.velX -= deltaV * xcomp;
            flake.velY -= deltaV * ycomp;

        } else {
            flake.velX *= .98;
            if (flake.velY <= flake.speed) {
                flake.velY = flake.speed
            }
            flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
        }

        ctx.fillStyle = "rgba(255,255,255," + flake.opacity + ")";
        flake.y += flake.velY;
        flake.x += flake.velX;

        if (flake.y >= canvas.height || flake.y <= 0) {
            reset(flake);
        }


        if (flake.x >= canvas.width || flake.x <= 0) {
            reset(flake);
        }

        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fill();
    }
    snowAnimID = requestAnimationFrame(snow);
};

function reset(flake) {
    flake.x = Math.floor(Math.random() * canvas.width);
    flake.y = 0;
    flake.size = (Math.random() * 3) + 2;
    flake.speed = (Math.random() * 1) + 0.5;
    flake.velY = flake.speed;
    flake.velX = 0;
    flake.opacity = (Math.random() * 0.5) + 0.3;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function sortBalls(level) {
    let numbers = [];

    for(let i = 0; i < level + 1; i += 1) {
        numbers.push(i);
    }

    shuffleArray(numbers);

    for (let i = 0; i < numbers.length; i += 1) {
        christmasBalls.push({
            left: dataBalls[i].left,
            top: dataBalls[i].top,
            num: numbers[i] + 1,
            show: true
        });
    }
}

function checkHit(x, y) {
    for (let i = 0; i < christmasBalls.length; i += 1) {
        // если игрок нажал в какой-то шар
        if (x > christmasBalls[i].left + xMod - 35 &&
            x < christmasBalls[i].left + xMod + 35 &&
            y > christmasBalls[i].top + yMod - 35 &&
            y < christmasBalls[i].top + yMod + 35) {
                currentBall ++;

                // если номер шара по порядку совпадает с цифрой на нем
                if (currentBall === christmasBalls[i].num) {
                    christmasBalls[i].show = true;
                    return christmasBalls[i].num;
                }
        }
    }
}

function init(level) {
    for (let i = 0; i < flakeCount; i++) {
        let x = Math.floor(Math.random() * canvas.width),
            y = Math.floor(Math.random() * canvas.height),
            size = (Math.random() * 3) + 2,
            speed = (Math.random() * 1) + 0.5,
            opacity = (Math.random() * 0.5) + 0.3;

        flakes.push({
            speed: speed,
            velY: speed,
            velX: 0,
            x: x,
            y: y,
            size: size,
            stepSize: (Math.random()) / 30,
            step: 0,
            opacity: opacity
        });
    }

    tree = document.querySelector(".tree[data-level="+"'" + level + "'"+"]");

    drawTree();
    snow();

    if (level !== 7) {
        sortBalls(level);
        showAndHideBallNumbers.level = level;
        timerId = setTimeout(showAndHideBallNumbers, 500);
    }

    return 108;
};

canvas.addEventListener("mousemove", function(e) {
    mX = e.clientX;
    mY = e.clientY;
});

function newRound(success) {
    level = success ? level + 1 : 1;
    christmasBalls = [];
    currentBall = 0;
    timeIsUp = false;
    cancelAnimationFrame(animId);
    cancelAnimationFrame(treeAnimID);
    cancelAnimationFrame(snowAnimID);
    clearTimeout(timerId);
    animId = 0;
    animDuration = 0;
    showTime = 180;
}

canvas.addEventListener("click", function(e){
    let playerX = e.clientX,
        playerY = e.clientY;

    const correctBall = checkHit(playerX, playerY);

    if(!correctBall || correctBall === level + 1) {
        newRound(correctBall);
        game();
    }
});

window.addEventListener("resize",function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    xMod = (canvas.width - 800) / 2;
    yMod = (canvas.height - 800) / 2;
})

function game() {
    console.log('new game, level = ', level);
    init(level);
}

game();

