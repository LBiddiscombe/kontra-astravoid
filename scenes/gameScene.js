import { Scene, Sprite, SpriteSheet, Pool, getCanvas, load, imageAssets, setImagePath } from 'kontra'

export function createGameScene() {
  const canvas = getCanvas()

  const minFrequency = 0.2
  let spriteSheet
  let frequency = 1
  let asteroids = []

  function sample(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

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
      update: function () {
        this.advance()
        if (this.y > canvas.height + this.height || this.x < 0 - this.width || this.x > canvas.width + this.width)
          this.ttl = 0
      },
    })
    asteroid.playAnimation(sample(['spin', 'spin2']))
    asteroids.push(asteroid)
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
  })

  return scene
}
