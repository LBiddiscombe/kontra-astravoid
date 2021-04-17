import { Pool, Sprite, randInt } from 'kontra'
import { sample } from './logic'

let trail = Pool({
  create: Sprite,
})

function addToTrail(pointer) {
  trail.get({
    x: pointer.x,
    y: pointer.y,
    dx: randInt(-3, 3),
    dy: randInt(5, 10),
    anchor: { x: 0.5, y: 0.5 },
    height: randInt(10, 30),
    color: sample(['yellow', 'red', 'orange', 'white', 'blue']),
    ttl: 30,
    update: function () {
      this.advance()
      this.width = this.height
      this.opacity = this.ttl / 60
      //this.height = (1 / this.ttl) * 20 // / 30) * 20
    },
  })
}

export { trail, addToTrail }
