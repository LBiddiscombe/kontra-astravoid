import { Sprite, Pool, getCanvas } from 'kontra'

let stars = Pool({
  create: Sprite,
})

function createStars() {
  if (stars.size) return stars

  const canvas = getCanvas()
  let size

  for (let i = 0; i < stars.maxSize; i++) {
    size = Math.random() * 2
    stars.get({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: size,
      height: size,
      color: 'white',
    })
  }
  return stars
}

export { createStars }
