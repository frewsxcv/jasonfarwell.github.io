var svg = d3.select(".icon").append("svg")
	.attr("width", "100%")
	.attr("height", "100%");

update();

function update() {
	var color = "rgb(0," + Math.random() * 255 + "," + Math.random() * 255 + ")";

	svg.transition()
		.duration(100)
		.style("background-color", color)
		.each("end", update);
}