import './style.css'
import { init, initPointer, on, GameLoop } from 'kontra'
import { createBootScene } from './scenes/bootScene'
import { createMenuScene } from './scenes/menuScene'
import { createGameScene } from './scenes/game/gameScene'
import { createGameOverScene } from './scenes/gameOverScene'
import { createStars } from './shared/stars'

// #region Canvas
const { canvas } = init()
canvas.width = Math.min(window.innerWidth, 768)
canvas.height = window.innerHeight
// #endregion

// #region Controls
initPointer()
// #endregion

// #region Scenes
const stars = createStars()
const bootScene = createBootScene()
let currentScene = bootScene
currentScene.show()

on('navigate', (name) => {
  currentScene.hide()
  currentScene.destroy()

  switch (name) {
    case 'menu':
      currentScene = createMenuScene()
      break
    case 'game':
      currentScene = createGameScene()
      break
    case 'gameOver':
      currentScene = createGameOverScene()
      break
  }

  currentScene.show()
})
// #endregion

// #region GameLoop
let loop = GameLoop({
  update: function () {
    currentScene.update()
  },
  render: function () {
    stars.render()
    currentScene.render()
  },
})

loop.start()
// #endregion
