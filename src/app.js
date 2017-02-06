import {MOBILE} from './constants'
import Controls from './Controls'
import Player from './Player'
import Map from './Map'
import Camera from './Camera'

const slike = ['../assets/nebo.jpg', '../assets/wall_texture.jpg', '../assets/mitraljez.png']

const ucitaj = src => {
  return new Promise((uspeh, neuspeh) => {
    const img = new Image()
    img.onload = () => uspeh()
    img.onerror = () => neuspeh()
    img.src = src
  })
}

class GameLoop {
  constructor() {
    this.frame = this.frame.bind(this)
    this.lastTime = 0
    this.callback = function() {}
  }

  start(callback) {
    this.callback = callback
    requestAnimationFrame(this.frame)
  }

  frame(time) {
    const dt = (time - this.lastTime) / 1000
    this.lastTime = time
    if (dt < 0.2) this.callback(dt)
    requestAnimationFrame(this.frame)
  }
}

/** INIT **/

const display = document.getElementById('display')
const player = new Player(15.3, -1.2, Math.PI * 0.3)
const map = new Map(32)
const controls = new Controls()
const camera = new Camera(display, MOBILE ? 160 : 320, 0.8)
const loop = new GameLoop()

map.randomize()

const mainLoop = dt => {
  map.update(dt)
  player.update(controls.states, map, dt)
  camera.render(player, map)
}

Promise.all(slike.map(ucitaj)).then(() => loop.start(mainLoop))
