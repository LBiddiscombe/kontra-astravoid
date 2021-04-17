import { getCanvas, Sprite, Text, Grid, Scene, load, setImagePath, on, emit } from 'kontra'

export function createBootScene() {
  const canvas = getCanvas()
  let assets = ['asteroid_spritesheet.png']

  setImagePath('/assets')

  let loadingText = Text({
    color: '#FF7F00',
    text: 'Loading...',
    font: '18px sans-serif',
    anchor: { x: 0.5, y: 0.5 },
  })

  let loadingBar = Sprite({
    width: canvas.width / 2,
    height: 30,
    progress: 0,
    anchor: { x: 0.5, y: 0.5 },
    render() {
      this.context.strokeStyle = 'white'
      this.context.strokeRect(0, 0, this.width, this.height)

      this.context.fillStyle = 'green'
      this.context.fillRect(1, 1, this.width * (this.progress / assets.length) - 2, this.height - 2)
    },
  })

  let grid = Grid({
    x: canvas.width / 2,
    y: canvas.height / 2,

    // put extra space between the button and progress bar
    rowGap: 4,
    anchor: { x: 0.5, y: 0.5 },
    children: [loadingText, loadingBar],
  })

  const bootScene = Scene({
    id: 'boot',
    children: [grid],
  })

  load(...assets).then(() => {
    setTimeout(() => {
      emit('navigate', 'menu')
    }, 500)
  })

  on('assetLoaded', (asset, url) => {
    if (loadingBar.progress < assets.length) loadingBar.progress++
  })

  return bootScene
}
