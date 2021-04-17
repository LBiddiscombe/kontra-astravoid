import { Sprite } from 'kontra'
import { showCollisionBoundaries } from './config'

let collisionBoundaries = []

function clearCollisionBoundaries() {
  collisionBoundaries = []
}

const addCollisionCircle = (x, y, r) => {
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

function checkCollision(asteroid, pointer) {
  const { type, x, y, radius } = asteroid.collisionBoundary
  const distX = pointer.x - x
  const distY = pointer.y - y
  const radii = radius + 20

  if (showCollisionBoundaries) {
    if (type === 'circle') addCollisionCircle(x, y, radius)
  }

  return distX * distX + distY * distY <= radii * radii
}

function sample(array) {
  return array[Math.floor(Math.random() * array.length)]
}

export { collisionBoundaries, sample, checkCollision, clearCollisionBoundaries }
