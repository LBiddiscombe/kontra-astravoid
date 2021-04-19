import { Text, Grid, Scene, getCanvas, emit, getStoreItem, track, untrack } from 'kontra'

export function createMenuScene() {
  const canvas = getCanvas()

  let title = Text({
    text: document.title,
    x: canvas.width / 2,
    y: 50,
    color: 'white',
    font: '48px Faster One',
    anchor: { x: 0.5, y: 0.5 },
  })

  let tapToStart = Text({
    text: 'Hold finger down',
    color: 'lawngreen',
    font: 'bold 32px Nova Round, monospace',
    anchor: { x: 0.5, y: 0.5 },
  })

  let instructions = Text({
    text: "Don't lift. Avoid the asteroids. Be a hero.",
    color: 'lightgrey',
    font: '16px Nova Round, monospace',
    anchor: { x: 0.5, y: 0.5 },
  })

  let lastScore = Text({
    text: 'Last Score',
    color: 'lightgrey',
    font: '24px Nova Mono, monospace',
  })

  let hiScore = Text({
    text: 'Hi Score',
    color: 'gold',
    font: '24px Nova Mono, monospace',
  })

  let countdown = Text({
    text: '3',
    value: 3,
    color: 'lawngreen',
    font: '64px Nova Mono, monospace',
  })

  let menu = Grid({
    x: canvas.width / 2,
    y: canvas.height / 3,
    anchor: { x: 0.5, y: 0.5 },
    rowGap: [16, 64],
    justify: 'center',
    children: [tapToStart, instructions, lastScore, hiScore],
  })

  const scene = Scene({
    id: 'menu',
    width: canvas.width,
    height: canvas.height,
    children: [title, menu],
    onShow: function () {
      lastScore.text = `Last Score: ${getStoreItem('score') || 0}`
      hiScore.text = `Hi-Score: ${getStoreItem('hiscore') || 0}`
    },
    onHide: function () {
      untrack(scene)
    },
    onDown: function () {
      menu.children = [tapToStart, instructions, countdown]

      const timer = setInterval(() => {
        countdown.value -= 1
        if (countdown.value <= 0) {
          clearInterval(timer)
          emit('navigate', 'game')
        }
        countdown.text = `${countdown.value}`
      }, 1000)
    },
  })

  track(scene)

  return scene
}
