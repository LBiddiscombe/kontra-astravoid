import { Sprite, SpriteSheet, getCanvas, imageAssets, degToRad, randInt } from 'kontra'

let spriteSheet
let asteroids = []

const loadSpriteSheet = () => {
  spriteSheet = SpriteSheet({
    image: imageAssets['asteroid1Spritesheet'],
    frameWidth: 128,
    frameHeight: 128,
    animations: {
      spin: {
        frames: '0..15',
        frameRate: 32,
      },
    },
  })
}

export function clearAsteroids() {
  asteroids = []
}

export function addAsteroid() {
  if (!spriteSheet) loadSpriteSheet()

  const canvas = getCanvas()
  const radius = randInt(16, canvas.width / 8)

  const asteroid = Sprite({
    x: Math.random() * canvas.width,
    y: -radius,
    radius: radius,
    width: radius * 2,
    height: radius * 2,
    anchor: { x: 0.5, y: 0.5 },
    collider: {
      radius: radius * 0.75, // bring collision boundary in to give a little leeway
    },
    rotation: Math.random() * 2 - Math.random() * 2,
    angle: randInt(65, 115), // direction of movement
    speed: Math.random() * 8 + 2,
    animations: spriteSheet.animations,
    ttl: Infinity,
    update: function () {
      this.advance()

      // set dx and dy based on angle and speed (velocity)
      const angleRadians = degToRad(this.angle)
      this.dx = Math.cos(angleRadians) * this.speed
      this.dy = Math.sin(angleRadians) * this.speed

      // destroy asteroids out of bounds
      if (this.y > canvas.height + this.height || this.x < 0 - this.width || this.x > canvas.width + this.width) {
        this.ttl = 0
      }
    },
  })
  asteroids.push(asteroid)
  asteroids = asteroids.filter((a) => a.isAlive())
}

export { asteroids }
