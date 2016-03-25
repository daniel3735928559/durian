fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.hasControls = false;

var socket = io.connect('http://localhost:5000/elderberry');
socket.on('projection', function(msg) {
    canvas.clear().renderAll();
    var data = msg['data'];
    for (i = 0; i < data.length; i++) {
	dot = new fabric.Circle({
	    left:   data[i][0],
	    top:    data[i][1],
	    radius: 9,
	    fill:   rainbow[data[i][2]]
	});

	dot.hasControls = false;

	canvas.add(dot);
    }
    canvas.renderAll();
});
socket.on('connect', function() {});
socket.emit('init_projection', {});

canvas = new fabric.Canvas('c1', { backgroundColor: "#000" });

var i, dot,
    getRandomInt = fabric.util.getRandomInt,
    rainbow    = ["#ffcc66", "#ccff66", "#66ccff", "#ff6fcf", "#ff6666"],
    rainbowEnd = rainbow.length - 1;

results1 = document.getElementById('results-c1');

function animate(e, dir) {
    if (e.target) {
	fabric.util.animate({
	    onChange: function(value) {
		data = {};
		if (canvas.getActiveGroup() != undefined){
		    for (i in canvas.getObjects()){
			
			if (canvas.getObjects()[i].active){
			    data[i] = [
				canvas.getObjects()[i].getLeft() + canvas.getActiveGroup().left, 
				canvas.getObjects()[i].getTop()  + canvas.getActiveGroup().top
			    ];
			}
		    }
		}
		else{
		    data['singleton'] = e.target.setCoords();
		}
	    },
	    onComplete: function() {}
	});
    }
}

generate_data();

canvas.on('object:moving', function(e) { 
    animate(e, 1);
});
canvas.on('object:modified', function(e) { 
    socket.emit('get_projection', {'view':[]});
});

points = canvas._objects
