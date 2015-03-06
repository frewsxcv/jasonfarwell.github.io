var canvas = d3.select(".icon"),
	context = canvas.node().getContext("2d"),
	width = canvas.property("width"),
	height = canvas.property("height"),
	cells = new Array(width * height),
	frontier = [],
	visited = 0,
	hue = 172;

// needed for pixel manipulation
var image = context.createImageData(width, height);

// directions in row-major order
var NORTH = -width,
	SOUTH = width,
	EAST = 1,
	WEST = -1;

//choose a random corner to start at
corner = (Math.floor(Math.random() * 4))
if (corner == 0) {
	index = 0;
	frontier.push({index: index, direction: SOUTH});
	frontier.push({index: index, direction: EAST});
}
else if (corner == 1) {
	index = width - 1;
	frontier.push({index: index, direction: SOUTH});
	frontier.push({index: index, direction: WEST});
}
else if (corner == 2) {
	index = width * (height - 1);
	frontier.push({index: index, direction: NORTH});
	frontier.push({index: index, direction: EAST});
}
else {
	index = (width * height) - 1;
	frontier.push({index: index, direction: NORTH});
	frontier.push({index: index, direction: WEST});
}

// mark cell as visited
cells[index] = visited;
setPixel(index);

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

		// add neighbors to frontier list
		if (cells[index + NORTH] == null && index + NORTH > 0) frontier.push({index: index, direction: NORTH});
		if (cells[index + SOUTH] == null && index + SOUTH < cells.length) frontier.push({index: index, direction: SOUTH});
		if (cells[index + EAST] == null && index % width != width - 1) frontier.push({index: index, direction: EAST});
		if (cells[index + WEST] == null && index % width != 0) frontier.push({index: index, direction: WEST});

		// mark cell as visited
		cells[index] = visited;
		setPixel(index);
	}
}

function setPixel(index) {
	index = index * 4;
	var color = d3.hsl((hue += 0.075) % 360, 1, 0.5).rgb();
	image.data[index + 0] = color.r;
	image.data[index + 1] = color.g;
	image.data[index + 2] = color.b;
	image.data[index + 3] = 255;
	context.putImageData(image, 0, 0);
}

function popRandom(array) {
	if (!array.length) return;
	var n = array.length, i = Math.random() * n | 0, t;
	t = array[i], array[i] = array[n - 1], array[n - 1] = t;
	return array.pop();
}