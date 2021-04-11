import { Scene, Sprite, Pool, getCanvas, emit, pointerPressed } from 'kontra'

export function createGameScene() {
  const canvas = getCanvas()

  let balls = Pool({
    create: Sprite,
  })

  function sample(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  for (let i = 0; i < 250; i += 1) {
    balls.get({
      radius: Math.random() * 50 + 10,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      color: sample(['#dc143c', '#14dc8c', '#a0dc14']),
      render: function () {
        this.context.fillStyle = this.color
        this.context.beginPath()
        this.context.arc(0, 0, this.radius, 0, 2 * Math.PI)
        this.context.fill()
      },
      update: function () {
        if (pointerPressed('left')) {
          emit('navigate', 'gameOver')
        }
      },
    })
  }

  return Scene({
    id: 'menu',
    children: [balls],
    cullObjects: false,
  })
}
