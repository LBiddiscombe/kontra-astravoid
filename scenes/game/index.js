import { Scene, Sprite, Pool, getPointer, onPointerUp, emit, Text, setStoreItem, getStoreItem } from 'kontra'
import { createStars } from '../../objects/stars'
import { asteroids, clearAsteroids, addAsteroid } from './asteroids'
import { showCollisionBoundary, minFrequency } from './config'

export function createGameScene() {
  const pointer = getPointer()
  const stars = createStars()
  let frequency = 1
  let collisionBoxes = []

  let scoreUI = Text({
    value: 0,
    x: 10,
    y: 10,
    color: 'white',
    font: '32px sans-serif',
  })

  let trail = Pool({
    create: Sprite,
  })

  function youLose() {
    setStoreItem('score', scoreUI.value)
    if (scoreUI.value > getStoreItem('hiscore')) {
      setStoreItem('hiscore', scoreUI.value)
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
    onShow: function () {
      clearAsteroids()
      collisionBoxes = []
    },
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
        addAsteroid()
        scene.children = asteroids
        this.timer = 0
        frequency = Math.max(frequency - Math.random() / 50, minFrequency)
      }

      // update score
      scoreUI.value += 1
      scoreUI.text = 'Score: ' + scoreUI.value

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
      scoreUI.render()
      if (showCollisionBoundary) {
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

    if (showCollisionBoundary) {
      console.log('add collision box')
      addCollisionBox(asteroidX, asteroidY, asteroidRadius)
    }

    return distX * distX + distY * distY <= radii * radii
  }

  return scene
}
