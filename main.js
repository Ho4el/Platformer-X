import kaplay from "kaplay";
const JUMP_FORCE = 1000;
const SCALE = 0.3

const k = kaplay({
    width: 1280,
    height: 720,
    letterbox: true,
    background: [43, 133, 145],
});

scene("game", () => {
        
    setGravity(1600);

    // load a sprite "bean" from an image
    k.loadBean();

    // putting together our player character
    const bean = add([sprite("bean"), pos(200, 40), area(), body()]);

    onKeyPress("space", () => {
        if (bean.isGrounded()) {
            bean.jump(1000);
        }
    });

    // add lava 1
    add([
        rect(width(), 48),
        pos(0, height() - 48),
        outline(4),
        area(),
        body({ isStatic: true }),
        color(127, 0, 0),
        'Lava'
    ]);

    // add lava 2
    add([
        rect(50, height()),
        pos(0, 0),
        outline(4),
        area(),
        color(127, 0, 0),
        'Lava'
    ]);


    // add platform
    add([
        rect(400, 30),
        body({ isStatic: true }),
        area(),
        outline(4),
        pos(150, 200),
        anchor("botleft"),
        color(255, 180, 255),
        move(LEFT, 240),
        offscreen({destroy: true}),
        "platform"
    ]);


    // keep track of score
    let score = 0;
    const scoreLabel = add([text(score), pos(24, 24)]);

    // increment score every frame
    loop(1, () => {
        score++;
        scoreLabel.text = score;
    });

    bean.onCollide("Lava", () => {
        // go to "lose" scene and pass the score
        go("lose", score);
        burp();
    });

    function spawnPlatform() {
        add([
            rect(200, 50),
            body({ isStatic: true }),
            area(),
            outline(4),
            pos(width(), rand(300, 600)),
            anchor("botleft"),
            color(255, 180, 255),
            move(LEFT, 540),
            offscreen({ destroy: true }),
            "platform"
        ]);

        wait(rand(0.3, 1), spawnPlatform);
    };

    spawnPlatform();

    onKeyDown("a", () => {
        bean.move(-500, 0);
    });
    
    onKeyDown("d", () => {
        bean.move(500, 0);
    });

});









scene("lose", (score) => {
    add([
        sprite("bean"),
        pos(width() / 2, height() / 2 - 80),
        scale(SCALE * 2),
        anchor("center"),
    ]);


    // display score
    add([
        text(score),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);


    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));

});


go("game");