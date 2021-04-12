import './style.css'
import { init, initPointer, getPointer, on, GameLoop, untrack } from 'kontra'
import { createMenuScene } from './scenes/menuScene'
import { createGameScene } from './scenes/gameScene'
import { createGameOverScene } from './scenes/gameOverScene'

// #region Canvas
const { canvas } = init()
canvas.width = Math.min(window.innerWidth, 768)
canvas.height = window.innerHeight //(canvas.width / 2) * 3
// #endregion

// #region Controls
initPointer()
// #endregion

// #region Scenes
const menuScene = createMenuScene()
const gameOverScene = createGameOverScene()
let currentScene = menuScene

on('navigate', (name) => {
  switch (name) {
    case 'menu':
      currentScene.hide()
      currentScene = menuScene
      break
    case 'game':
      currentScene.destroy()
      currentScene = createGameScene()
      break
    case 'gameOver':
      currentScene.destroy()
      currentScene = gameOverScene
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
    currentScene.render()
  },
})

loop.start()
// #endregion
