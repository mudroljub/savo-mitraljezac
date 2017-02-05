/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const CIRCLE = Math.PI * 2
/* harmony export (immutable) */ __webpack_exports__["b"] = CIRCLE;

const MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
/* harmony export (immutable) */ __webpack_exports__["a"] = MOBILE;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Bitmap;
function Bitmap(src, width, height) {
  this.image = new Image()
  this.image.src = src
  this.width = width || this.image.naturalWidth
  this.height = height || this.image.naturalHeight
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = Camera;


function Camera(canvas, resolution, focalLength) {
  this.ctx = canvas.getContext('2d');
  this.width = canvas.width = window.innerWidth * 0.5;
  this.height = canvas.height = window.innerHeight * 0.5;
  this.resolution = resolution;
  this.spacing = this.width / resolution;
  this.focalLength = focalLength || 0.8;
  this.range = __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* MOBILE */] ? 8 : 14;
  this.lightRange = 15;
  this.scale = (this.width + this.height) / 1200;
}

Camera.prototype.render = function(player, map) {
  this.drawSky(player.direction, map.skybox, map.light);
  this.drawColumns(player, map);
  this.drawWeapon(player.weapon, player.paces);
};

Camera.prototype.drawSky = function(direction, sky, ambient) {
  var width = sky.width * (this.height / sky.height) * 2;
  var left = (direction / __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* CIRCLE */]) * -width;

  this.ctx.save();
  this.ctx.fillStyle = '#701206'
  this.ctx.fillRect(0, this.height/2, this.width, this.height)  // crta tlo
  this.ctx.drawImage(sky.image, left, 0, width, this.height * 0.5);
  if (left < width - this.width) {
    this.ctx.drawImage(sky.image, left + width, 0, width, this.height * 0.5 );
  }
  if (ambient > 0) {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.globalAlpha = ambient * 0.1;
    this.ctx.fillRect(0, this.height * 0.5, this.width, this.height * 0.5);
  }
  this.ctx.restore();
};

Camera.prototype.drawColumns = function(player, map) {
  this.ctx.save();
  for (var column = 0; column < this.resolution; column++) {
    var x = column / this.resolution - 0.5;
    var angle = Math.atan2(x, this.focalLength);
    var ray = map.cast(player, player.direction + angle, this.range);
    this.drawColumn(column, ray, angle, map);
  }
  this.ctx.restore();
};

Camera.prototype.drawWeapon = function(weapon, paces) {
  var bobX = Math.cos(paces * 2) * this.scale * 6;
  var bobY = Math.sin(paces * 4) * this.scale * 6;
  var left = this.width * 0.20 + bobX;
  var top = this.height * 0.6 + bobY;
  this.ctx.drawImage(weapon.image, left, top, weapon.width * this.scale, weapon.height * this.scale);
};

Camera.prototype.drawColumn = function(column, ray, angle, map) {
  var ctx = this.ctx;
  var texture = map.wallTexture;
  var left = Math.floor(column * this.spacing);
  var width = Math.ceil(this.spacing);
  var hit = -1;

  while (++hit < ray.length && ray[hit].height <= 0);

  for (var s = ray.length - 1; s >= 0; s--) {
    var step = ray[s];
    var rainDrops = Math.pow(Math.random(), 3) * s;
    var rain = (rainDrops > 0) && this.project(0.1, angle, step.distance);

    if (s === hit) {
      var textureX = Math.floor(texture.width * step.offset);
      var wall = this.project(step.height, angle, step.distance);

      ctx.globalAlpha = 1;
      ctx.drawImage(texture.image, textureX, 0, 1, texture.height, left, wall.top, width, wall.height);

      ctx.fillStyle = '#000000';
      ctx.globalAlpha = Math.max((step.distance + step.shading) / this.lightRange - map.light, 0);
      ctx.fillRect(left, wall.top, width, wall.height);
    }

    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.15;
    while (--rainDrops > 0) ctx.fillRect(left, Math.random() * rain.top, 1, rain.height);
  }
};

Camera.prototype.project = function(height, angle, distance) {
  var z = distance * Math.cos(angle);
  var wallHeight = this.height * height / z;
  var bottom = this.height / 2 * (1 + 1 / z);
  return {
    top: bottom - wallHeight,
    height: wallHeight
  };
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Controls;
function Controls() {
  this.codes = {
    37: 'left',
    39: 'right',
    38: 'forward',
    40: 'backward'
  };
  this.states = {
    'left': false,
    'right': false,
    'forward': false,
    'backward': false
  };
  document.addEventListener('keydown', this.onKey.bind(this, true), false);
  document.addEventListener('keyup', this.onKey.bind(this, false), false);
  document.addEventListener('touchstart', this.onTouch.bind(this), false);
  document.addEventListener('touchmove', this.onTouch.bind(this), false);
  document.addEventListener('touchend', this.onTouchEnd.bind(this), false);
}

Controls.prototype.onTouch = function(e) {
  var t = e.touches[0];
  this.onTouchEnd(e);
  if (t.pageY < window.innerHeight * 0.5) this.onKey(true, {
    keyCode: 38
  });
  else if (t.pageX < window.innerWidth * 0.5) this.onKey(true, {
    keyCode: 37
  });
  else if (t.pageY > window.innerWidth * 0.5) this.onKey(true, {
    keyCode: 39
  });
};

Controls.prototype.onTouchEnd = function(e) {
  this.states = {
    'left': false,
    'right': false,
    'forward': false,
    'backward': false
  };
  e.preventDefault();
  e.stopPropagation();
};

Controls.prototype.onKey = function(val, e) {
  var state = this.codes[e.keyCode];
  if (typeof state === 'undefined') return;
  this.states[state] = val;
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
};


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Bitmap__ = __webpack_require__(1);
/* harmony export (immutable) */ __webpack_exports__["a"] = Map;


function Map(size) {
  this.size = size
  this.wallGrid = new Uint8Array(size * size)
  this.skybox = new __WEBPACK_IMPORTED_MODULE_0__Bitmap__["a" /* default */]('assets/nebo.jpg', 2000, 750)
  this.wallTexture = new __WEBPACK_IMPORTED_MODULE_0__Bitmap__["a" /* default */]('assets/wall_texture.jpg', 1024, 1024)
  this.kisha = new Audio('assets/kisha.mp3')
  this.kisha.volume = 0.5
  this.kisha.loop = true
  this.kisha.play()
  this.grom = new Audio('assets/grom.mp3')
  this.light = 0 // za svetlo groma
}

Map.prototype.get = function(x, y) {
  x = Math.floor(x)
  y = Math.floor(y)
  if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return -1
  return this.wallGrid[y * this.size + x]
}

Map.prototype.randomize = function() {
  for (var i = 0; i < this.size * this.size; i++) {
    this.wallGrid[i] = Math.random() < 0.3 ? 1 : 0
  }
}

Map.prototype.cast = function(point, angle, range) {
  var self = this
  var sin = Math.sin(angle)
  var cos = Math.cos(angle)
  var noWall = {
    length2: Infinity
  }

  return ray({
    x: point.x,
    y: point.y,
    height: 0,
    distance: 0
  })

  function ray(origin) {
    var stepX = step(sin, cos, origin.x, origin.y)
    var stepY = step(cos, sin, origin.y, origin.x, true)
    var nextStep = stepX.length2 < stepY.length2 ?
      inspect(stepX, 1, 0, origin.distance, stepX.y) :
      inspect(stepY, 0, 1, origin.distance, stepY.x)

    if (nextStep.distance > range) return [origin]
    return [origin].concat(ray(nextStep))
  }

  function step(rise, run, x, y, inverted) {
    if (run === 0) return noWall
    var dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x
    var dy = dx * (rise / run)
    return {
      x: inverted ? y + dy : x + dx,
      y: inverted ? x + dx : y + dy,
      length2: dx * dx + dy * dy
    }
  }

  function inspect(step, shiftX, shiftY, distance, offset) {
    var dx = cos < 0 ? shiftX : 0
    var dy = sin < 0 ? shiftY : 0
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


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Bitmap__ = __webpack_require__(1);
/* harmony export (immutable) */ __webpack_exports__["a"] = Player;



function Player(x, y, direction) {
  this.x = x
  this.y = y
  this.direction = direction
  this.weapon = new __WEBPACK_IMPORTED_MODULE_1__Bitmap__["a" /* default */]('assets/mitraljez.png')
  this.rafal = new Audio('assets/rafal.mp3')
  this.paces = 0
  document.addEventListener('keydown', e => e.keyCode == 32 && this.rafal.play())
}

Player.prototype.rotate = function(angle) {
  this.direction = (this.direction + angle + __WEBPACK_IMPORTED_MODULE_0__constants__["b" /* CIRCLE */]) % (__WEBPACK_IMPORTED_MODULE_0__constants__["b" /* CIRCLE */])
}

Player.prototype.walk = function(distance, map) {
  var dx = Math.cos(this.direction) * distance
  var dy = Math.sin(this.direction) * distance
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


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Controls__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Player__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Map__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Camera__ = __webpack_require__(2);






function GameLoop() {
  this.frame = this.frame.bind(this);
  this.lastTime = 0;
  this.callback = function() {};
}

GameLoop.prototype.start = function(callback) {
  this.callback = callback;
  requestAnimationFrame(this.frame);
};

GameLoop.prototype.frame = function(time) {
  var seconds = (time - this.lastTime) / 1000;
  this.lastTime = time;
  if (seconds < 0.2) this.callback(seconds);
  requestAnimationFrame(this.frame);
};

var display = document.getElementById('display');
var player = new __WEBPACK_IMPORTED_MODULE_2__Player__["a" /* default */](15.3, -1.2, Math.PI * 0.3);
var map = new __WEBPACK_IMPORTED_MODULE_3__Map__["a" /* default */](32);
var controls = new __WEBPACK_IMPORTED_MODULE_1__Controls__["a" /* default */]();
var camera = new __WEBPACK_IMPORTED_MODULE_4__Camera__["a" /* default */](display, __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* MOBILE */] ? 160 : 320, 0.8);
var loop = new GameLoop();

map.randomize();

loop.start(function frame(seconds) {
  map.update(seconds);
  player.update(controls.states, map, seconds);
  camera.render(player, map);
});


/***/ })
/******/ ]);