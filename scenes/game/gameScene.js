import { Scene, Text, emit, setStoreItem, getStoreItem, track, untrack, getCanvas } from 'kontra'
import { asteroids, clearAsteroids, addAsteroid } from './asteroids'
import { debugColliders, minAsteroidFrequency } from './config'
import { checkCollision, drawColliders } from './logic'
import { createPlayer } from './player'
import { oscillator, timestamp } from '../../shared/helpers'

export function createGameScene() {
  const canvas = getCanvas()
  let [player, trail] = createPlayer()
  let asteroidFrequency = 1
  let start = timestamp()

  let scoreUI = Text({
    value: 0,
    x: 10,
    y: 10,
    color: '#4deeea',
    font: 'Bold 32px Comfortaa',
    render: function () {
      this.context.shadowBlur = 8
      this.context.shadowColor = this.color
      this.draw()
    },
  })

  function youLose() {
    setStoreItem('score', scoreUI.value)
    if (scoreUI.value > getStoreItem('hiscore')) {
      setStoreItem('hiscore', scoreUI.value)
    }
    emit('navigate', 'gameOver')
  }

  let scene = Scene({
    id: 'game',
    width: canvas.width,
    height: canvas.height,
    timer: 0,
    onShow: function () {
      clearAsteroids()
    },
    onHide: function () {
      untrack(scene)
    },
    onUp: function () {
      youLose()
    },
    update: function () {
      this.advance()
      player.update()
      trail.update()

      // check if pointer collides with sprite
      asteroids.forEach((asteroid) => {
        asteroid.update()
        if (checkCollision(asteroid, player)) {
          youLose()
        }
      })

      // spawn new asteroids in waves
      this.timer += 1 / 60
      if (this.timer > asteroidFrequency) {
        this.timer = 0
        addAsteroid()
        asteroidFrequency = Math.max(
          oscillator(timestamp() - start, { duration: 10000, offset: 0.5 }),
          minAsteroidFrequency
        )
      }

      // update score
      scoreUI.value += 1
      scoreUI.text = 'Score: ' + scoreUI.value
    },
    render: function () {
      player.render()
      if (debugColliders) drawColliders(player)
      trail.render()
      asteroids.forEach((asteroid) => {
        asteroid.render()
        if (debugColliders) drawColliders(asteroid)
      })

      scoreUI.render()
    },
  })

  track(scene)

  return scene
}
