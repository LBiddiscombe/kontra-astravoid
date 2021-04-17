import { Scene, Sprite, Pool, getPointer, onPointerUp, emit, Text, setStoreItem, getStoreItem } from 'kontra'
import { createStars } from '../../objects/stars'
import { asteroids, clearAsteroids, addAsteroid } from './asteroids'
import { showCollisionBoundaries, minAsteroidFrequency } from './config'
import { collisionBoundaries, checkCollision, clearCollisionBoundaries } from './logic'

export function createGameScene() {
  const pointer = getPointer()
  const stars = createStars()
  let asteroidFrequency = 1

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
    },
    update: function () {
      this.advance()
      // check if pointer collides with sprite
      if (showCollisionBoundaries) clearCollisionBoundaries()
      asteroids.forEach((asteroid) => {
        if (checkCollision(asteroid, pointer)) {
          youLose()
        }
      })
      this.timer += 1 / 60
      if (this.timer > asteroidFrequency) {
        addAsteroid()
        scene.children = asteroids
        this.timer = 0
        asteroidFrequency = Math.max(asteroidFrequency - Math.random() / 50, minAsteroidFrequency)
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
      if (showCollisionBoundaries) {
        collisionBoundaries.forEach((collisionBoundary) => {
          collisionBoundary.render()
        })
      }
    },
  })

  return scene
}
