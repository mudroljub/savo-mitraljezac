import {CIRCLE} from './constants'
import Bitmap from './Bitmap'
import mitraljez from '../assets/mitraljez.png'
import rafal from '../assets/rafal.mp3'

export default function Player(x, y, direction) {
  this.x = x
  this.y = y
  this.direction = direction
  this.weapon = new Bitmap(mitraljez)
  this.rafal = new Audio(rafal)
  this.paces = 0
  document.addEventListener('keydown', e => e.keyCode == 32 && this.rafal.play())
}

Player.prototype.rotate = function(angle) {
  this.direction = (this.direction + angle + CIRCLE) % (CIRCLE)
}

Player.prototype.walk = function(distance, map) {
  const dx = Math.cos(this.direction) * distance
  const dy = Math.sin(this.direction) * distance
  if (map.get(this.x + dx, this.y) <= 0) this.x += dx
  if (map.get(this.x, this.y + dy) <= 0) this.y += dy
  this.paces += distance
}

Player.prototype.update = function(controls, map, seconds) {
  if (controls.left) this.rotate(-Math.PI * seconds)
  if (controls.right) this.rotate(Math.PI * seconds)
  if (controls.forward) this.walk(3 * seconds, map)
  if (controls.backward) this.walk(-3 * seconds, map)
}
