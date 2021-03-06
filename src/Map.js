import Bitmap from './Bitmap'
import nebo from '../assets/nebo.jpg'
import kisha from '../assets/kisha.mp3'
import beton from '../assets/wall_texture.jpg'
import grom from '../assets/grom.mp3'

export default function Map(size) {
  this.size = size
  this.wallGrid = new Uint8Array(size * size)
  this.skybox = new Bitmap(nebo, 2000, 750)
  this.wallTexture = new Bitmap(beton, 1024, 1024)
  this.kisha = new Audio(kisha)
  this.kisha.volume = 0.5
  this.kisha.loop = true
  this.kisha.play()
  this.grom = new Audio(grom)
  this.light = 0 // za svetlo groma
}

Map.prototype.get = function(x, y) {
  x = Math.floor(x)
  y = Math.floor(y)
  if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return -1
  return this.wallGrid[y * this.size + x]
}

Map.prototype.randomize = function() {
  for (let i = 0; i < this.size * this.size; i++) {
    this.wallGrid[i] = Math.random() < 0.3 ? 1 : 0
  }
}

Map.prototype.cast = function(point, angle, range) {
  const self = this
  const sin = Math.sin(angle)
  const cos = Math.cos(angle)
  const noWall = {
    length2: Infinity
  }

  return ray({
    x: point.x,
    y: point.y,
    height: 0,
    distance: 0
  })

  function ray(origin) {
    const stepX = step(sin, cos, origin.x, origin.y)
    const stepY = step(cos, sin, origin.y, origin.x, true)
    const nextStep = stepX.length2 < stepY.length2 ?
      inspect(stepX, 1, 0, origin.distance, stepX.y) :
      inspect(stepY, 0, 1, origin.distance, stepY.x)

    if (nextStep.distance > range) return [origin]
    return [origin].concat(ray(nextStep))
  }

  function step(rise, run, x, y, inverted) {
    if (run === 0) return noWall
    const dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x
    const dy = dx * (rise / run)
    return {
      x: inverted ? y + dy : x + dx,
      y: inverted ? x + dx : y + dy,
      length2: dx * dx + dy * dy
    }
  }

  function inspect(step, shiftX, shiftY, distance, offset) {
    const dx = cos < 0 ? shiftX : 0
    const dy = sin < 0 ? shiftY : 0
    step.height = self.get(step.x - dx, step.y - dy)
    step.distance = distance + Math.sqrt(step.length2)
    if (shiftX) step.shading = cos < 0 ? 2 : 0
    else step.shading = sin < 0 ? 2 : 1
    step.offset = offset - Math.floor(offset)
    return step
  }
}

Map.prototype.update = function(dt) {
  if (this.light > 0) {
    this.light = Math.max(this.light - 10 * dt, 0)
  }
  else if (Math.random() * 5 < dt) {
    this.light = 2
    this.grom.volume = Math.random()
    this.grom.play()
  }
}
