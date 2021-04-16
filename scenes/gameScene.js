import {
  Scene,
  Sprite,
  Pool,
  SpriteSheet,
  getCanvas,
  getPointer,
  load,
  imageAssets,
  setImagePath,
  onPointerUp,
  emit,
  degToRad,
  randInt,
  Text,
  setStoreItem,
  getStoreItem,
} from 'kontra'
import { createStars } from '../objects/stars'

export function createGameScene() {
  const showCollisionBoxes = true
  const canvas = getCanvas()
  const pointer = getPointer()
  const stars = createStars()
  const minFrequency = 0.2
  let spriteSheet
  let frequency = 1
  let asteroids = []
  let collisionBoxes = []

  setImagePath('/assets')

  let score = Text({
    value: 0,
    x: 10,
    y: 10,
    color: 'white',
    font: '32px sans-serif',
  })

  let trail = Pool({
    create: Sprite,
  })

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
    const radius = randInt(16, canvas.width / 8)
    const asteroid = Sprite({
      x: Math.random() * canvas.width,
      y: -radius,
      radius: radius,
      width: radius * 2,
      height: radius * 2,
      anchor: { x: 0.5, y: 0.5 },
      rotation: Math.random() * 2 - Math.random() * 2,
      angle: randInt(70, 110),
      speed: Math.random() * 8 + 2,
      animations: spriteSheet.animations,
      ttl: Infinity,
      update: function () {
        // set dx and dy based on angle and speed (velocity)
        const angleRadians = degToRad(this.angle)
        this.dx = Math.cos(angleRadians) * this.speed
        this.dy = Math.sin(angleRadians) * this.speed
        this.advance()
        if (this.y > canvas.height + this.height || this.x < 0 - this.width || this.x > canvas.width + this.width) {
          this.ttl = 0
        }
      },
    })
    asteroid.playAnimation(sample(['spin', 'spin2']))
    asteroids.push(asteroid)
    asteroids = asteroids.filter((a) => a.ttl > 0)
    scene.children = asteroids
  }

  function youLose() {
    setStoreItem('score', score.value)
    if (score.value > getStoreItem('hiscore')) {
      setStoreItem('hiscore', score.value)
    }
    emit('navigate', 'gameOver')
  }

  onPointerUp(function () {
    youLose()
  })

  let scene = Scene({
    id: 'game',
    cullObjects: false,
    timer: 0,
    update: function () {
      this.advance()
      // check if pointer collides with sprite
      collisionBoxes = []
      asteroids.forEach((asteroid) => {
        if (checkCollision(asteroid, pointer)) {
          youLose()
        }
      })
      this.timer += 1 / 60
      if (this.timer > frequency) {
        addAsteroid(spriteSheet)
        this.timer = 0
        frequency = Math.max(frequency - Math.random() / 50, minFrequency)
      }

      // update score
      score.value += 1
      score.text = 'Score: ' + score.value

      // show a trail for pointer
      trail.get({
        x: pointer.x,
        y: pointer.y,
        radius: 20,
        color: 'yellow',
        ttl: 30,
        render: function () {
          this.context.fillStyle = this.color
          this.context.beginPath()
          this.context.arc(0, 0, this.radius, 0, 2 * Math.PI)
          this.context.fill()
        },
        update: function () {
          this.advance()
          this.opacity = this.ttl / 240
          this.radius = (this.ttl / 30) * 20
        },
      })
      trail.update()
    },
    render: function () {
      stars.render()
      trail.render()
      score.render()
      if (showCollisionBoxes) {
        addCollisionBox(pointer.x, pointer.y, 20)
        collisionBoxes.forEach((collisionBox) => {
          collisionBox.render()
        })
      }
    },
  })

  const addCollisionBox = (x, y, r) => {
    const box = Sprite({
      x: x,
      y: y,
      r: r,
      render: function () {
        this.context.strokeStyle = 'red'
        this.context.lineWidth = 2
        this.context.beginPath()
        this.context.arc(0, 0, r, 0, 2 * Math.PI)
        this.context.stroke()
      },
    })
    collisionBoxes.push(box)
  }

  function checkCollision(asteroid, pointer) {
    const asteroidX = asteroid.x + asteroid.dx
    const asteroidY = asteroid.y + asteroid.dy
    const asteroidRadius = asteroid.radius * 0.75
    const distX = pointer.x - asteroid.x
    const distY = pointer.y - asteroid.y
    const radii = asteroidRadius + 20

    if (showCollisionBoxes) {
      addCollisionBox(asteroidX, asteroidY, asteroidRadius)
    }

    return distX * distX + distY * distY <= radii * radii
  }

  function sample(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  return scene
}
