import { Pool, Sprite, randInt } from 'kontra'
import { sample } from './logic'

let trail = Pool({
  create: Sprite,
})

function addToTrail(player) {
  trail.get({
    x: player.x,
    y: player.y + player.radius,
    dx: randInt(-2, 2),
    dy: randInt(5, 10),
    anchor: { x: 0.5, y: 0.5 },
    height: randInt(5, 10),
    color: sample(['white', 'lightgrey', 'yellow', 'red', 'orange']),
    ttl: 30,
    update: function () {
      this.advance()
      this.width = this.height
      this.opacity = this.ttl / 30
    },
  })
}

export { trail, addToTrail }
