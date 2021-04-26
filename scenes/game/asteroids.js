import { Sprite, Pool, getCanvas, degToRad, randInt, clamp } from 'kontra'
import { choose } from '../../shared/helpers'

let asteroids = []

export function clearAsteroids() {
  asteroids = []
}

export function addAsteroid() {
  const canvas = getCanvas()
  const radius = randInt(16, canvas.width / 8)
  const numNodes = 12
  const spriteX = Math.random() * canvas.width
  const spriteY = -radius
  const nodes = createAsteroidNodes(numNodes, radius)

  let explosion = Pool({
    create: Sprite,
    maxSize: 12,
  })

  const asteroid = Sprite({
    x: spriteX,
    y: spriteY,
    radius: radius,
    width: radius * 2,
    height: radius * 2,
    anchor: { x: 0.5, y: 0.5 },
    nodes: nodes,
    lineWidth: radius / 10,
    collider: {
      active: true,
      radius: radius * 0.9, // bring collision boundary in to give a little leeway
    },
    angle: degToRad(randInt(65, 115)), // direction of movement
    speed: Math.random() * 8 + 2,
    spinSpeed: Math.random() / 10 - Math.random() / 10,
    ttl: Infinity,
    update: function () {
      this.advance()
      explosion.update()

      // set dx and dy based on angle and speed (velocity)
      this.dx = Math.cos(this.angle) * this.speed
      this.dy = Math.sin(this.angle) * this.speed
      this.rotation += this.spinSpeed

      // destroy asteroids out of bounds
      if (this.y > canvas.height + this.height || this.x < 0 - this.width || this.x > canvas.width + this.width) {
        this.ttl = 0
      }

      // explode asteroid if hit
      if (this.ttl === Infinity && Math.random() < 0.001) {
        this.ttl = 30
        this.collider.active = false
        this.spinSpeed = 0

        for (let i = 0; i < this.nodes.length; i++) {
          const angle = (i / this.nodes.length) * Math.PI * 2
          const x = this.nodes[i].x
          const y = this.nodes[i].y
          const dx = Math.cos(angle) * asteroid.lineWidth * Math.random() * 2
          const dy = Math.sin(angle) * asteroid.lineWidth * Math.random() * 2

          explosion.get({
            x,
            y,
            dx,
            dy,
            radius: asteroid.lineWidth * 5,
            anchor: { x: 0.5, y: 0.5 },
            color: 'white', //choose(['white', 'yellow', 'red', 'gray']),
            ttl: 30,
            update: function () {
              this.advance()
              this.radius += Math.random() * 3
              this.opacity = this.ttl / 30
            },
            render: function () {
              this.context.fillStyle = this.color
              this.context.beginPath()
              this.context.arc(0, 0, this.radius, 0, 2 * Math.PI)
              this.context.fill()
            },
          })
        }
      }

      // exploding
      if (this.ttl !== Infinity) {
        this.radius -= radius / 100
        this.opacity = clamp(0, 1, this.ttl / 60)
      }
    },
    render: function () {
      if (this.ttl === Infinity) drawAsteroid(this.context, this.nodes, this.lineWidth)
      else {
        explosion.render()
      }
    },
  })
  asteroids.push(asteroid)
  asteroids = asteroids.filter((a) => a.isAlive())
}

function createAsteroidNodes(numNodes = 12, radius = 64) {
  const nodes = []
  for (let i = 0; i < numNodes; i++) {
    const offset = i % 2 === 0 ? -(Math.random() * (radius / 4)) : 0
    const angle = (i / (numNodes / 2)) * Math.PI
    const x = Math.trunc((radius + offset) * Math.cos(angle)) + radius
    const y = Math.trunc((radius + offset) * Math.sin(angle)) + radius
    nodes.push({ x, y })
  }

  return nodes
}

function drawAsteroid(context, nodes, lineWidth = 5) {
  context.beginPath()
  for (let i = 0; i < nodes.length - 1; i++) {
    var xc = (nodes[i].x + nodes[i + 1].x) / 2
    var yc = (nodes[i].y + nodes[i + 1].y) / 2
    context.quadraticCurveTo(nodes[i].x, nodes[i].y, xc, yc)
  }
  const i = nodes.length - 1
  context.quadraticCurveTo(nodes[i].x, nodes[i].y, nodes[0].x, nodes[0].y)
  //context.closePath()

  context.strokeStyle = 'white'
  context.lineWidth = lineWidth
  context.lineCap = 'round'
  context.shadowBlur = lineWidth * 3
  context.shadowColor = 'white'
  context.fillStyle = 'black'
  context.fill()
  context.stroke()
}

export { asteroids }
