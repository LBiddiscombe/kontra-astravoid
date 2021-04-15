import { Text, Grid, Scene, getCanvas, emit, getStoreItem, onPointerDown } from 'kontra'
import { createStars } from '../objects/stars'

export function createMenuScene() {
  const canvas = getCanvas()
  const stars = createStars()

  let title = Text({
    text: document.title,
    x: canvas.width / 2,
    y: 50,
    color: 'white',
    font: '48px sans-serif',
    anchor: { x: 0.5, y: 0.5 },
  })

  let tapToStart = Text({
    text: 'Hold finger down to start',
    color: '#bada55',
    font: '32px sans-serif',
    anchor: { x: 0.5, y: 0.5 },
  })

  let scores = Text({
    text: 'Last Score',
    color: 'yellow',
    font: '24px sans-serif',
  })

  let menu = Grid({
    x: canvas.width / 2,
    y: canvas.height / 2,
    anchor: { x: 0.5, y: 0.5 },
    rowGap: 64,
    justify: 'center',
    children: [tapToStart, scores],
  })

  onPointerDown(function () {
    emit('navigate', 'game')
  })

  return Scene({
    id: 'menu',
    children: [title, menu],
    render: function () {
      stars.render()
    },
    onShow: function () {
      scores.text = `Last Score: ${getStoreItem('score') || 0}\nHi-Score: ${getStoreItem('hiscore') || 0}`
    },
  })
}
