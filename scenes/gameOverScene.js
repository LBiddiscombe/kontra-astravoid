import { Text, Grid, Scene, getCanvas, emit, getStoreItem } from 'kontra'

export function createGameOverScene() {
  const canvas = getCanvas()

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
    onShow: function () {
      score.text = `Score: ${getStoreItem('score')}`
      hiscore.text = `Hi-Score: ${getStoreItem('hiscore')}`
      setTimeout(() => {
        emit('navigate', 'menu')
      }, 2000)
    },
  })
}
