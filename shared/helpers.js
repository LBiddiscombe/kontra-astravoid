function oscillator(time, options) {
  /*
  time: in milliseconds
  options {
    duration: time required for one complete wave in milliseconds
    magnitude: complete wave height between peak and trough (e.g. 100 has a range -50 to 50)
    phase: how far through the wave to begin. 0.25=peak, 0.75=trough
    offset: how much to add before returning result
  }
  */
  const { duration = 1000, magnitude = 1, phase = 0, offset = 0 } = options
  return Math.sin((time / duration) * Math.PI * 2 + phase * (Math.PI * 2)) * (magnitude / 2) + offset
}

// Choose a random element from an an array
function choose(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime()
}

export { oscillator, choose, timestamp }
