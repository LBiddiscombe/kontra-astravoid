import { Sprite } from 'kontra'
import { showCollisionBoundaries } from './config'

let collisionBoundariesSet = new Set()
let collisionBoundaries = []

function clearCollisionBoundaries() {
  collisionBoundariesSet.clear()
  collisionBoundaries = []
}

const addDebugCollisionBoundary = (sprite) => {
  if (collisionBoundariesSet.has(sprite)) return
  let boundary
  if (sprite.collisionBoundary.type === 'circle') {
    boundary = Sprite({
      x: sprite.collisionBoundary.x,
      y: sprite.collisionBoundary.y,
      r: sprite.collisionBoundary.radius,
      render: function () {
        this.context.strokeStyle = 'red'
        this.context.lineWidth = 2
        this.context.beginPath()
        this.context.arc(0, 0, this.r, 0, 2 * Math.PI)
        this.context.stroke()
      },
    })
  }
  if (sprite.type === 'box') {
    boundary = Sprite({
      x: sprite.collisionBoundary.x,
      y: sprite.collisionBoundary.y,
      width: sprite.collisionBoundary.width,
      height: sprite.collisionBoundary.height,
      render: function () {
        this.context.strokeStyle = 'red'
        this.context.lineWidth = 2
        this.context.beginPath()
        this.context.rect(this.x, this.y, this.width, this.height)
        this.context.stroke()
      },
    })
  }
  collisionBoundariesSet.add(sprite)
  if (boundary) {
    collisionBoundaries.push(boundary)
  }
}

function checkCollision(enemy, player) {
  if (showCollisionBoundaries) {
    addDebugCollisionBoundary(enemy)
    addDebugCollisionBoundary(player)
  }

  const { x, y, radius } = enemy.collisionBoundary
  const distX = player.collisionBoundary.x - x
  const distY = player.collisionBoundary.y - y
  const radii = radius + player.collisionBoundary.radius

  return distX * distX + distY * distY <= radii * radii
}

export { collisionBoundaries, checkCollision, clearCollisionBoundaries }
