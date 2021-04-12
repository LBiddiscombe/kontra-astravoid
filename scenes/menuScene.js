import { Button, Text, Grid, Scene, getCanvas, emit } from 'kontra'

export function createMenuScene() {
  const canvas = getCanvas()

  let title = Text({
    text: document.title,
    x: canvas.width / 2,
    y: 50,
    color: 'white',
    font: '32px sans-serif',
    anchor: { x: 0.5, y: 0.5 },
  })

  let button = Button({
    x: 300,
    y: 100,
    anchor: { x: 0.5, y: 0.5 },
    text: {
      text: 'Hold finger down to start',
      color: '#bada55',
      font: '32px sans-serif',
      anchor: { x: 0.5, y: 0.5 },
    },
    padX: canvas.width / 2,
    padY: canvas.height / 2,
    onDown: function () {
      emit('navigate', 'game')
    },
  })

  let menu = Grid({
    x: canvas.width / 2,
    y: canvas.height / 2,
    anchor: { x: 0.5, y: 0.5 },
    rowGap: 15,
    justify: 'center',
    children: [button],
  })

  return Scene({
    id: 'menu',
    children: [title, menu],
  })
}
