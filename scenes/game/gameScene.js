import { Scene, getPointer, onPointerUp, emit, Text, setStoreItem, getStoreItem } from 'kontra'
import { asteroids, clearAsteroids, addAsteroid } from './asteroids'
import { showCollisionBoundaries, minAsteroidFrequency } from './config'
import { collisionBoundaries, checkCollision, clearCollisionBoundaries } from './logic'
import { addToTrail, trail } from './trail'

export function createGameScene() {
  const pointer = getPointer()
  let asteroidFrequency = 1

  let scoreUI = Text({
    value: 0,
    x: 10,
    y: 10,
    color: 'white',
    font: '32px Nova Mono, monospace',
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
      trail.clear()
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
        this.timer = 0
        addAsteroid()
        scene.children = asteroids
        asteroidFrequency = Math.max(asteroidFrequency - Math.random() / 50, minAsteroidFrequency)
      }

      // update score
      scoreUI.value += 1
      scoreUI.text = 'Score: ' + scoreUI.value

      addToTrail(pointer)
      trail.update()
    },
    render: function () {
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
