import { Text, Grid, Scene, getCanvas, emit, getStoreItem } from 'kontra'

export function createGameOverScene() {
  const canvas = getCanvas()
  let timer

  let lose = Text({
    text: 'Game Over',
    color: 'tomato',
    font: 'bold 48px Nova Mono, monospace',
  })

  let score = Text({
    text: '',
    color: 'lightgrey',
    font: 'bold 48px Nova Mono, monospace',
  })

  let hiscore = Text({
    text: '',
    color: 'gold',
    font: '24px Nova Mono, monospace',
  })

  let loseGrid = Grid({
    x: canvas.width / 2,
    y: canvas.height / 3,
    anchor: { x: 0.5, y: 0.5 },
    rowGap: 64,
    justify: 'center',
    children: [lose, score],
  })

  return Scene({
    id: 'gameOver',
    children: [loseGrid],
    onHide: function () {
      clearTimeout(timer)
    },
    onShow: function () {
      score.text = `Score: ${getStoreItem('score')}`
      hiscore.text = `Hi-Score: ${getStoreItem('hiscore')}`
      timer = setTimeout(() => {
        emit('navigate', 'menu')
      }, 2000)
    },
  })
}
