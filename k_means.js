var points = [];
var means = [];
var k = 3;
var colors = [
	"#FF0000", 
	"#00FF00", 
	"#0000FF", 
	"#FFFF00", 
	"#FF00FF", 
	"#00FFFF"
];
				
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

draw();

canvas.addEventListener('click', function(event) {
	elemLeft = canvas.offsetLeft;
	elemTop = canvas.offsetTop;
	var x = event.pageX - elemLeft,
		y = event.pageY - elemTop;
		points.push({'x': x, 'y': y, 'c': 0});
		//alert(points[points.length - 1].x + ", " + points[points.length - 1].y);
		draw();
}, false);

function change_k(radio) {
	k = radio.value;
	draw();
}

function d(p1, p2) {
	return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

function cluster() {
	if(points.length <= k) {
		for(var i = 0; i < points.length; i++) {
			points[i].c = i;
		}
		return;
	}

	for(var i = 0; i < k; i++) {
		means[i] = {};
		means[i].x = points[i].x;
		means[i].y = points[i].y;
	}
	var has_change = true;
	while(has_change) {
		has_change = false;
		for(var i = 0; i < points.length; i++) {
			points[i].c = 0;
			points[i].d = 1e9;
			for(var j = 0; j < k; j++) {
			var dd = d(points[i], means[j]);
				if(dd < points[i].d) {
					points[i].c = j;
					points[i].d = dd;
				}
			}
		}
		
		for(var i = 0; i < k; i++) {
			means[i].counter = 0;
			means[i].last_x = means[i].x;
			means[i].last_y = means[i].y;
			means[i].x = 0;
			means[i].y = 0;
		}
		
		for(var i = 0; i < points.length; i++) {
			means[points[i].c].x += points[i].x;
			means[points[i].c].y += points[i].y;
			means[points[i].c].counter++;
		}
		
		for(var i = 0; i < k; i++) {
			means[i].x /= means[i].counter;
			means[i].y /= means[i].counter;
			if(means[i].last_x != means[i].x || means[i].last_y != means[i].y) {
				has_change = true;
			}
		}
	}

}


function draw() {
	ctx.beginPath();
	ctx.rect(0, 0, 600, 600);
	ctx.fillStyle = "#CCCCCC";
	ctx.fill();
	
	cluster();
	
	for(var i = 0; i < points.length; i++) {
		//ctx.strokeStyle = colors[points[i].c];
		ctx.beginPath();
		ctx.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
		ctx.fillStyle = colors[points[i].c];
		ctx.fill();
	}
}
