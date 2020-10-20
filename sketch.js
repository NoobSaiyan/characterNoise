const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes/1000.json');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  const colorCount = random.rangeFloor(2,7)
  const palette = random.shuffle(random.pick(palettes)).slice(0,colorCount)
  const background = palette.shift()
  const characters = '=-~'.split('');


  const createGrid = () => {
    const points = [];
    const count = 40;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u,v)) * 0.072 ;
        points.push({
          color: random.pick(palette),
          radius,
          position: [ u, v ],
          character: random.pick(characters),
          rotation:random.noise2D(u,v)
        });
      }
    }
    return points;
  };
  const points = createGrid().filter(()=>random.value()> 0.055)
  

  return ({ context, width, height }) => {
    const margin = width * 0.195;

    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        color,
        radius,
        position,
        character,
        rotation
      } = data;
      const x = lerp(margin, width - margin, position[0]);
      const y = lerp(margin, height - margin, position[1]);

      context.save()
      context.fillStyle = color;
      context.font = `${radius* width*2}px "Helvetica"`
      context.translate(x,y)
      context.rotate(rotation)
      context.fillText(character,0,0)

      context.restore()
    });
  };
};

canvasSketch(sketch, settings);