import {
  Scene,
  Sprite,
  SpriteSheet,
  Pool,
  getCanvas,
  load,
  imageAssets,
  setImagePath,
  onPointerUp,
  emit,
  track,
  untrack,
} from 'kontra'

export function createGameScene() {
  const canvas = getCanvas()

  const minFrequency = 0.2
  let spriteSheet
  let frequency = 1
  let asteroids = []

  let stars = Pool({
    create: Sprite,
  })

  for (let i = 0; i < 1000; i++) {
    stars.get({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: Math.random() * 2,
      height: Math.random() * 2,
      color: 'white',
    })
  }

  onPointerUp(function () {
    asteroids.forEach((asteroid) => untrack(asteroid))
    emit('navigate', 'gameOver')
  })

  setImagePath('/assets')
  load('asteroid_spritesheet.png').then(() => {
    spriteSheet = SpriteSheet({
      image: imageAssets['asteroid_spritesheet'],
      frameWidth: 128,
      frameHeight: 128,
      animations: {
        spin: {
          frames: '1..31',
          frameRate: 32,
        },
        spin2: {
          frames: '32..63',
          frameRate: 32,
        },
      },
    })

    addAsteroid(spriteSheet)
  })

  function addAsteroid(spriteSheet) {
    const scale = Math.random() * 1 + 0.25
    const asteroid = Sprite({
      x: Math.random() * canvas.width,
      y: -50,
      anchor: { x: 0.5, y: 0.5 },
      rotation: Math.random() * 2 - Math.random() * 2,
      scaleX: scale,
      scaleY: scale,
      dx: Math.random() * 2 - Math.random() * 2,
      dy: Math.random() * 6 + 2,
      animations: spriteSheet.animations,
      ttl: Infinity,
      collidesWithPointer: function (pointer) {
        // perform a circle v circle collision test
        let dx = pointer.x - this.x
        let dy = pointer.y - this.y
        return Math.sqrt(dx * dx + dy * dy) < (this.width * this.scaleX) / 2
      },
      onOver: function () {
        asteroids.forEach((asteroid) => untrack(asteroid))
        emit('navigate', 'gameOver')
      },
      update: function () {
        this.advance()
        if (this.y > canvas.height + this.height || this.x < 0 - this.width || this.x > canvas.width + this.width)
          this.ttl = 0
      },
    })
    asteroid.playAnimation(sample(['spin', 'spin2']))
    asteroids.push(asteroid)
    track(asteroid)
    const deadAsteroids = asteroids.filter((a) => a.ttl <= 0)
    deadAsteroids.forEach((asteroid) => untrack(asteroid))
    asteroids = asteroids.filter((a) => a.ttl > 0)
    scene.children = asteroids
  }

  let scene = Scene({
    id: 'game',
    cullObjects: false,
    timer: 0,
    update: function () {
      this.advance()
      this.timer += 1 / 60
      if (this.timer > frequency) {
        addAsteroid(spriteSheet)
        this.timer = 0
        frequency = Math.max(frequency - Math.random() / 50, minFrequency)
      }
    },
    render: function () {
      stars.render()
    },
  })

  return scene
}

function sample(array) {
  return array[Math.floor(Math.random() * array.length)]
}
