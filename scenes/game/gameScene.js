import {
  Scene,
  Sprite,
  imageAssets,
  getPointer,
  onPointerUp,
  emit,
  Text,
  setStoreItem,
  getStoreItem,
  angleToTarget,
} from 'kontra'
import { asteroids, clearAsteroids, addAsteroid } from './asteroids'
import { showCollisionBoundaries, minAsteroidFrequency } from './config'
import { collisionBoundaries, checkCollision, clearCollisionBoundaries } from './logic'
import { addToTrail, trail } from './trail'

export function createGameScene() {
  const pointer = getPointer()
  let asteroidFrequency = 1

  let player = Sprite({
    anchor: { x: 0.5, y: 0.5 },
    radius: 20,
    image: imageAssets['playerShip'],
    update: function () {
      this.rotation = angleToTarget(pointer, this) * -2
      this.advance()
      this.x = pointer.x
      this.y = pointer.y - 50
      // add a collision boundary, used for collision detection
      this.collisionBoundary = {
        type: 'circle',
        x: this.x,
        y: this.y,
        radius: this.radius, // bring collision boundary in to give a little leeway
      }
    },
  })

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
      player.update()
      // check if pointer collides with sprite
      if (showCollisionBoundaries) clearCollisionBoundaries()
      asteroids.forEach((asteroid) => {
        asteroid.update()
        if (checkCollision(asteroid, player)) {
          youLose()
        }
      })
      this.timer += 1 / 60
      if (this.timer > asteroidFrequency) {
        this.timer = 0
        addAsteroid()
        asteroidFrequency = Math.max(asteroidFrequency - Math.random() / 50, minAsteroidFrequency)
      }

      // update score
      scoreUI.value += 1
      scoreUI.text = 'Score: ' + scoreUI.value

      addToTrail(player)
      trail.update()
    },
    render: function () {
      asteroids.forEach((asteroid) => {
        asteroid.render()
      })
      trail.render()
      player.render()
      if (showCollisionBoundaries) {
        collisionBoundaries.forEach((collisionBoundary) => {
          collisionBoundary.render()
        })
      }
      scoreUI.render()
    },
  })

  return scene
}
