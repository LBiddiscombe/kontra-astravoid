import { Sprite, SpriteSheet, getCanvas, load, imageAssets, setImagePath, degToRad, randInt } from 'kontra'
import { sample } from './logic'

let spriteSheet
let asteroids = []

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

export function clearAsteroids() {
  asteroids = []
}

export function addAsteroid() {
  const canvas = getCanvas()
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
      this.advance()

      // set dx and dy based on angle and speed (velocity)
      const angleRadians = degToRad(this.angle)
      this.dx = Math.cos(angleRadians) * this.speed
      this.dy = Math.sin(angleRadians) * this.speed

      // add a collision boundary, used for collision detection
      this.collisionBoundary = {
        type: 'circle',
        x: this.x + this.dx,
        y: this.y + this.dy,
        radius: this.radius * 0.75, // bring collision boundary in to give a little leeway
      }

      // destroy asteroids out of bounds
      if (this.y > canvas.height + this.height || this.x < 0 - this.width || this.x > canvas.width + this.width) {
        this.ttl = 0
      }
    },
  })
  asteroid.playAnimation(sample(['spin', 'spin2']))
  asteroids.push(asteroid)
  asteroids = asteroids.filter((a) => a.ttl > 0)
}

export { asteroids }
