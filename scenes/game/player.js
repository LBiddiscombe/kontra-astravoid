import { Pool, Sprite, imageAssets, angleToTarget, getPointer, randInt, degToRad } from 'kontra'
import { choose } from '../../shared/helpers'

function createPlayer() {
  let trail = Pool({
    create: Sprite,
  })

  const pointer = getPointer()
  const radius = 20
  let player = Sprite({
    anchor: { x: 0.5, y: 0.5 },
    radius: radius,
    image: imageAssets['playerShip'],
    collider: {
      active: true,
      radius: radius * 0.75, // bring collision boundary in to give a little leeway
    },
    update: function () {
      this.advance()
      this.rotation = angleToTarget(pointer, this) * -2
      this.x = pointer.x
      this.y = pointer.y - 50
      emitTrail()
    },
    render: function () {
      this.context.shadowBlur = 10
      this.context.shadowColor = 'white'
      this.draw()
    },
  })

  function emitTrail() {
    const size = randInt(5, 10)
    trail.get({
      x: player.x,
      y: player.y + player.radius,
      angle: randInt(80, 100),
      speed: randInt(5, 10),
      anchor: { x: 0.5, y: 0.5 },
      height: size,
      width: size,
      //color: choose(['white', 'yellow', 'red', 'orange']),
      color: 'white',
      ttl: 30,
      update: function () {
        this.advance()
        const angleRadians = degToRad(this.angle) + player.rotation
        this.dx = Math.cos(angleRadians) * this.speed
        this.dy = Math.sin(angleRadians) * this.speed
        this.opacity = this.ttl / 15
      },
      render: function () {
        this.context.shadowBlur = size
        this.context.shadowColor = this.color
        this.context.fillStyle = this.color
        this.context.beginPath()
        this.context.arc(this.width / 2, this.height, this.width / 2, 0, 2 * Math.PI)
        this.context.fill()
      },
    })
  }

  return [player, trail]
}

export { createPlayer }
