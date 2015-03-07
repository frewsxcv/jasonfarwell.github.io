var canvas = d3.select(".icon"),
	context = canvas.node().getContext("2d"),
	width = canvas.property("width"),
	height = canvas.property("height"),
	cells = new Array(width * height),
	frontier = [],
	visited = 0;

var color1 = d3.rgb(41, 255, 158),
	color2 = d3.rgb(72, 155, 255),
	steps = 280,
	step = 0;

// needed for pixel manipulation
var image = context.createImageData(width, height);

// directions in row-major order
var NORTH = -width,
	SOUTH = width,
	EAST = 1,
	WEST = -1;

// initial cell
index = (width * height) - 1;

// mark cell as visited
cells[index] = visited;
setPixel(index);

// add neighbors to frontier list
frontier.push({index: index, direction: NORTH});
frontier.push({index: index, direction: WEST});

d3.timer(function() {
	var i = 0, done;
	while (i++ < 9 && !(done = expand()));
	return done;
});

function expand() {
	// choose a random frontier cell
	if ((next = popRandom(frontier)) == null) return true;
	index = next.index + next.direction;

	// check if cell is empty
	if (cells[index] == null) {

		// mark cell as visited
		cells[index] = visited;
		setPixel(index);

		// add neighbors to frontier list
		if (cells[index + NORTH] == null && index + NORTH > 0) frontier.push({index: index, direction: NORTH});
		if (cells[index + SOUTH] == null && index + SOUTH < cells.length) frontier.push({index: index, direction: SOUTH});
		if (cells[index + EAST] == null && index % width != width - 1) frontier.push({index: index, direction: EAST});
		if (cells[index + WEST] == null && index % width != 0) frontier.push({index: index, direction: WEST});
	}
}

function setPixel(index) {
	index *= 4;
	var blend = d3.rgb(color1.r + ((color2.r - color1.r) / steps) * step, color1.g + ((color2.g - color1.g) / steps) * step, color1.b + ((color2.b - color1.b) / steps) * step);
	step++;
	image.data[index + 0] = blend.r;
	image.data[index + 1] = blend.g;
	image.data[index + 2] = blend.b;
	image.data[index + 3] = 255;
	context.putImageData(image, 0, 0);
}

function popRandom(array) {
	if (!array.length) return;
	var n = array.length, i = Math.random() * n | 0, t;
	t = array[i], array[i] = array[n - 1], array[n - 1] = t;
	return array.pop();
}