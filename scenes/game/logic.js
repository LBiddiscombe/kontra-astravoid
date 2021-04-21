function checkCollision(enemy, player) {
  const distX = player.x - enemy.x
  const distY = player.y - enemy.y
  const radii = enemy.collider.radius + player.collider.radius

  return distX * distX + distY * distY <= radii * radii
}

function drawColliders(sprite) {
  // display anchor point
  sprite.context.fillStyle = 'yellow'
  sprite.context.beginPath()
  sprite.context.arc(sprite.x, sprite.y, 3, 0, 2 * Math.PI)
  sprite.context.fill()

  // display collision circle
  sprite.context.strokeStyle = 'red'
  sprite.context.lineWidth = 2
  sprite.context.beginPath()
  sprite.context.arc(sprite.x, sprite.y, sprite.collider.radius, 0, 2 * Math.PI)
  sprite.context.stroke()
}

export { checkCollision, drawColliders }
