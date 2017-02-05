export default function Bitmap(src, width, height) {
  this.image = new Image()
  this.image.src = src
  this.width = width || this.image.naturalWidth
  this.height = height || this.image.naturalHeight
}
