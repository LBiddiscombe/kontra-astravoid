import { Text, Grid, Scene, getCanvas, emit } from 'kontra'

export function createGameOverScene() {
  const canvas = getCanvas()

  let lose = Text({
    text: 'Game Over',
    color: 'tomato',
    font: '32px sans-serif',
  })

  let loseGrid = Grid({
    x: canvas.width / 2,
    y: canvas.height / 2,
    anchor: { x: 0.5, y: 0.5 },
    rowGap: 15,
    justify: 'center',
    children: [lose],
  })

  return Scene({
    id: 'gameOver',
    children: [loseGrid],
    onShow: function () {
      setTimeout(() => {
        emit('navigate', 'menu')
      }, 2000)
    },
  })
}
