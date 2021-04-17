import { Sprite, Pool, getCanvas } from 'kontra'

let stars = Pool({
  create: Sprite,
})

function createStars() {
  if (stars.size) return stars

  const canvas = getCanvas()

  for (let i = 0; i < 1000; i++) {
    stars.get({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: Math.random() * 2,
      height: Math.random() * 2,
      color: 'white',
    })
  }
  return stars
}

export { createStars }
