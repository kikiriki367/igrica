kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

// Variables
const FALL_DEATH = 2000

const MOVE_SPEED = 240
const JUMP_FORCE = 500
const IFRAMES_TIME = 1
let isJumping = true
let isPowered = false
let timerPowered = 0
let timeInvincible = 0

ENEMY_SPEED = 160
FLYING_ENEMY_SPEED = 200
ENEMY_SPAWN_TIME = 3
ENEMY_SPAWN_FREQUENCY = 3

let skor
let score = 0
let hg = 0


//localStorage.setItem('pozicija', '0');    //menjaj nivo za testiranje
//localStorage.setItem('skor', '0');       //menjaj score za testiranje
//localStorage.setItem('rekord', '0');       //menjaj score za testiranje

if (localStorage.getItem("pozicija") === null) {
    nivo = 0
    skor = 0
}else{  
    nivo = parseInt(localStorage.getItem("pozicija"))
    skor = localStorage.getItem("skor")
}

if(localStorage.getItem("rekord") === null){
    hg = 0;
}else{
    hg = localStorage.getItem("rekord")
}


// Sprite loading

loadRoot('https://i.imgur.com/')
loadSprite('block', '2Z1BapL.png')
loadSprite('surprise', '2mohQua.png')
loadSprite('coin', 'YBJdxW5.png')
loadSprite('cake', 'stNdIxR.png')
loadSprite('unboxed', 'Hu8wIHA.png')


loadSprite('enemy', 'o8GLTm0.png')
loadSprite('flying-enemy', '5prZOp4.png')
loadSprite('flying-enemy-spawner', 'Jsl8y7W.png')
loadSprite('base', 'hMRmQRo.png')
loadSprite('brka', 'YNyL5kw.png')
loadSprite('zmija', 'Wj3MifA.png')

loadSprite('bed1', 'wr0imWg.png')
loadSprite('bed2', 'B6VHLCf.png')

// Level design

//PLATFORMER
scene("platformer", ({ level, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj')

    const maps = [
        [
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                                      ',
            '                  ===                 ',
            '                                      ',
            '         ===%=%=*=                    ',
            '                                  ()  ',
            '                    ^   ^             ',
            '==============================   =====',
        ],
        [
            '                                                                          ',
            '                                                                          ',
            '                                                                          ',
            '                         ^                                                ',
            '                  ===                                 =                   ',
            '                       ^         ======================                   ',
            '         ===%=%=*=               ==                                       ',
            '                                 ==     ()                              @ ',
            '                    ^   ^        ==                                     = ',
            '==============================   =========================================',
        ],
        [   
            '                                                                                                                          ',
            '                                                                                                                          ',
            '         ^         %%     ^      %===           %            ===                                          !             @ ',
            '                             ^             !                           ^       *        ===                            !  ',
            '   *        ^              ==                       =*===   ^    !                                        ^               ',
            '                                              ^                             ^                           ^            ^    ',
            '          =================================================================================================               ',
            '          =        @    ^                                              ^                         ^                        ',
            '         ==                                            ^                                                         ^        ',
            '          =   ()                                                                                                          ',
            '          =           ^   ^                                ^   ^                                ^   ^                   @ ',
            '====================     =========   =======   ======    =====    =========   =====    ======   ======   ========   ======',
        ]
    ]

    const levelCfg = {
        
        // Sprite define
        width: 32,
        height: 32,
        '=': [sprite('block'), solid() ],
        '$': [sprite('coin'), 'coin'],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '*': [sprite('surprise'), solid(), 'cake-surprise'],
        '^': [sprite('enemy'), solid(), 'dangerous', 'enemy'],
        '!': [sprite('flying-enemy'), solid(), 'dangerous', 'flying-enemy'],
        '@': [sprite('flying-enemy-spawner'), solid(), 'dangerous', 'flying-enemy-spawner'],
        '}': [sprite('unboxed'), solid()],
        '#': [sprite('cake'), solid(), 'cake', body()],
        '(': [sprite('bed1'), solid(), scale(2), 'bed'],
        ')': [sprite('bed2'), solid(), scale(2), 'bed'],
    }

    const gameLevel = addLevel(maps[level], levelCfg)

    // Game design

    //Score
    camIgnore(["ui"]);// da score bude fixan

    const scoreLabel = add([
        text('Score:' + score, 16),
        pos(40, 48),
        layer('ui'),
        {
            value: score ,
        }
    ])

    //Level text
    add([
        text('level ' + parseInt(level + 1), 32),
        pos(32, 16),
        layer('ui'),
    ])


    const player = add([
        sprite('base'), solid(),
        pos(32, 0),
        body(),
        powered(),
        origin('bot'),
    ])

     //Player movement
     keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
    })
    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
    })

    player.action(() => {
        if (player.grounded()) {
            isJumping = false
        }
    })

    keyPress('space', () => {
        if (player.grounded()) {
            isJumping = true
            player.jump(JUMP_FORCE)
        }
    })

    keyPress('r', () => {        
        localStorage.setItem('pozicija', '0');    //menjaj nivo za testiranje
        localStorage.setItem('skor', '0');       //menjaj score za testiranje
        localStorage.setItem('rekord', '0');       //menjaj score za testiranje
        hg = 0;
    })

    
    function powered() {
        return {
            update() {
                if (isPowered) {
                    timerPowered -= dt()
                    if (timerPowered <= 0) {
                        this.powerDown()
                    }
                }
            },
            isPowered() {
                return isPowered
            },
            powerDown() {
                this.scale = vec2(1)
                timerPowered = 0
                isPowered = false
            },
            powerUp(timePower) {
                this.scale = vec2(2)
                timerPowered = timePower
                isPowered = true
            }
        }
    }

    //Player update
    player.on('update', () => {
        if (timeInvincible >= 0) {
            timeInvincible -= dt()
        }
    })

    player.on("headbump", (obj) => {
        if (obj.is('cake-surprise')) {
            gameLevel.spawn('#', obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0, 0))
        }
        if (obj.is('coin-surprise')) {
            gameLevel.spawn('$', obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0, 0))
        }       
    })

    //Player collides
    player.collides('cake', (c) => {
        destroy(c)
        player.powerUp(5)
    })

    player.collides('coin', (c) => {
        destroy(c)
        scoreLabel.value+= 3;
        scoreLabel.text = "Score: "+  scoreLabel.value
    })

    player.collides('dangerous', (d) => {
        if (player.pos.y - d.pos.y < 5) {
            scoreLabel.value++
            scoreLabel.text = "Score: " +   scoreLabel.value
            destroy(d)
        } else if (timeInvincible <= 0) {
            if (isPowered) {
                player.powerDown();
                timeInvincible = IFRAMES_TIME;
            } else {
                go('lose', { score: scoreLabel.value })
            }
        }
    })
    //Level finish
    player.collides('bed', () => {
        keyPress('down', () => {
            if(nivo == 0){
                localStorage.setItem('pozicija', '1');
                localStorage.setItem('skor', scoreLabel.value);
                document.location = 'zmijice.html';
            }else if(nivo == 1){
                localStorage.setItem('pozicija', '2');
                localStorage.setItem('skor', scoreLabel.value);
                document.location = 'invaders.html';
            }
            else{
                go('lose', { score: scoreLabel.value });
            }
        })
    })

    //Fall fail + camera
    player.action(() => {
        camPos(player.pos)
        if (player.pos.y >= FALL_DEATH) {
            go('lose', { score: scoreLabel.value })
        }
    })



    //Actions movement items and enemies

    action('cake', (c) => {
        c.move(30, 0)
    })

    action('enemy', (d) => {
        d.move(-ENEMY_SPEED, 0)
    })

    action('flying-enemy', (d) => {
        d.move(-Math.sign(d.pos.x - player.pos.x) * FLYING_ENEMY_SPEED, -Math.sign((d.pos.y + 32) - player.pos.y) * FLYING_ENEMY_SPEED)
    })

    action('flying-enemy-spawner', (d) => {
        if (ENEMY_SPAWN_TIME > 0) {
            ENEMY_SPAWN_TIME -= dt()
        }else{
            gameLevel.spawn('!', d.gridPos.sub(0, 1))
            ENEMY_SPAWN_TIME = ENEMY_SPAWN_FREQUENCY;
        }
    })    
})

//PLATFORMER

//ZMIJICE



//ZMIJICE



scene('lose', ({ score }) => {
    if(hg > score){
        add([text('RISE FROM YOUR GRAVE,\n NEVER GIVE UP!', 48), origin('center'), pos(width() / 2, height() / 2 - 160)])
        add([text('High score: ' + hg, 48), origin('center'), pos(width() / 2, height() / 2 - 64)])
        add([text('Your score: ' + score, 32), origin('center'), pos(width() / 2, height() / 2)])
    }else{
        add([text('CONGRADULATIOOONS!!!', 48), origin('center'), pos(width() / 2, height() / 2 - 128)])
        add([text('High score: ' + score, 48), origin('center'), pos(width() / 2, height() / 2 - 64)])
        add([text('Your score: ' + score, 32), origin('center'), pos(width() / 2, height() / 2)])
        localStorage.setItem('rekord', score);
    }
    localStorage.setItem('pozicija', '0');
    localStorage.setItem('skor', '0');

    keyPress('space', () => {
        document.location = 'index.html';
    })
})

start("platformer", { level: nivo, score: skor })