import { Sprite } from 'kontra'
import { showCollisionBoundaries } from './config'

let collisionBoundaries = []

function clearCollisionBoundaries() {
  collisionBoundaries = []
}

const addDebugCollisionCircle = (x, y, r) => {
  const circle = Sprite({
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
  collisionBoundaries.push(circle)
}

function checkCollision(asteroid, player) {
  const { type, x, y, radius } = asteroid.collisionBoundary
  const distX = player.x - x
  const distY = player.y - y
  const radii = radius + player.radius

  if (showCollisionBoundaries) {
    if (type === 'circle') addDebugCollisionCircle(x, y, radius)
  }

  return distX * distX + distY * distY <= radii * radii
}

export { collisionBoundaries, checkCollision, clearCollisionBoundaries }
