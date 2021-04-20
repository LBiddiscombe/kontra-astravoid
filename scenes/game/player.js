import { Pool, Sprite, imageAssets, angleToTarget, getPointer, randInt, degToRad } from 'kontra'
import { choose } from '../../shared/helpers'

function createPlayer() {
  let trail = Pool({
    create: Sprite,
  })

  const pointer = getPointer()
  let player = Sprite({
    anchor: { x: 0.5, y: 0.5 },
    radius: 20,
    image: imageAssets['playerShip'],
    update: function () {
      this.advance()
      this.rotation = angleToTarget(pointer, this) * -2
      this.x = pointer.x
      this.y = pointer.y - 50
      emitTrail()
      // add a collision boundary, used for collision detection
      this.collisionBoundary = {
        radius: this.radius * 0.75, // bring collision boundary in to give a little leeway
      }
    },
    render: function () {
      this.draw()
    },
  })

  function emitTrail() {
    trail.get({
      x: player.x,
      y: player.y + player.radius / 1.5,
      angle: randInt(80, 100),
      speed: randInt(5, 10),
      anchor: { x: 0.5, y: 0.5 },
      height: randInt(5, 10),
      color: choose(['silver', 'lightgrey', 'yellow', 'red', 'orange']),
      ttl: 30,
      update: function () {
        const angleRadians = degToRad(this.angle) + player.rotation
        this.dx = Math.cos(angleRadians) * this.speed
        this.dy = Math.sin(angleRadians) * this.speed
        this.advance()
        this.width = this.height
        this.opacity = this.ttl / 30
      },
    })
  }

  return [player, trail]
}

export { createPlayer }
