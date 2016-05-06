fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.hasControls = false;

var old_view = [];
var rainbow = ["#ffffff"];

prev_view = null;
current_view = null;

function update_view(){
    canvas.deactivateAll();
    var changed = [];
    var view_objs = [];
    var arr = canvas.getObjects()
    var method = angular.element(document.getElementById('c1')).scope().training_method;
    if(method == "all"){
	for (i = 0; i < arr.length; i++){
	    changed.push(i);
	    view_objs.push(arr[i]);
	}
    }
    else if(method == "changed"){
	for (i = 0; i < arr.length; i++){
	    if(arr[i].changed){
		changed.push(i);
		view_objs.push(arr[i]);
	    }
	}
    }

    var arr = canvas.getObjects();

    // for (i in classes){
    // 	dist[classes[i]] = 0
    // }

    // for (i = 0; i < arr.length; i++){
    // 	dist[classes[arr[i].label]] += 1 
    // }

    dataset = []
    // console.log(dist)
    // for(i in dist){
    // 	dataset.push({category: i, measure: dist[i]})
    // }

    d3.selectAll("svg").remove();
    dsPieChart(dataset);

    //------------------BAR CHART--------------
    bar_data = []
    for(i in current_view.ranking){
	bar_data.push({"letter": current_view.ranking[i][0], "frequency": current_view.ranking[i][1]})
    }
    
    make_bar_chart(bar_data)
    //--------------------------------------------------------
    
    lasso_flag = angular.element(document.getElementById('c1')).scope().lasso 
    socket.emit('get_projection', {'changed':changed,'view':get_normalised_coords(view_objs),'old':old_view, 'algorithm': angular.element(document.getElementById('c1')).scope().selected_alg, 'params':angular.element(document.getElementById('c1')).scope().get_params()});


}

function get_normalised_coords(objs){
    var answer = [];
    for(var i = 0; i < objs.length; i++){
	answer.push([(objs[i].getLeft()-canvas.width/2)/(canvas.width/2),(objs[i].getTop()-canvas.height/2)/(canvas.height/2)])
    }
    return answer;
}

function get_display_coords(x,y){
    return [(x+1)*canvas.width/2,(y+1)*canvas.height/2];
}

var loc = 'http://' + window.location.hostname + ':' + window.location.port+'/elderberry';

var socket = io.connect(loc);

function previous_view(){
    if(prev_view){
	set_view(prev_view.data, prev_view.ranking);
    }
}

function set_view(data, ranking, urls){
    prev_view = current_view;
    current_view = {'data':data,'ranking':ranking}
    canvas.clear().renderAll();
    for (i = 0; i < data.length; i++) {

	info_array.push(data[i][3])
	coords = get_display_coords(parseFloat(data[i][0]),parseFloat(data[i][1]));
	console.log("CC",coords)

	//------------------------- IMAGES--------------------------
	// URL = "static/pngs/"+urls[i];//"http://fabricjs.com/lib/pug.jpg"
	// fabric.Image.fromURL(URL, function (dot) {
	//     //oImg.set('left', PosX).set('top',PosY);
	//     canvas.add(dot);
	// }, {"left": coords[0], "top": coords[1], "scaleX": 0.125, "scaleY": 0.125,
	//     "stringValue": data[i][3], "label": data[i][2]});
    	// ----------------------------------------------------------
	
	dot = new fabric.Circle({
	    left:   coords[0],
	    top:    coords[1],
	    radius: 10,
	    fill:   rainbow[data[i][2]] //rainbow[data[i][2]
	});

	
	dot.setOriginX("center");
	dot.setOriginY("center");
	dot.hasControls = false;
	dot.stringValue = data[i][3];
	dot.label = data[i][2];
	canvas.add(dot);
    }
    canvas.renderAll();

    //---------------------PIE CHART-------------------
    var arr = canvas.getObjects()
    for (i = 0; i < arr.length; i++){
	arr[i].changed = false;
	old_view.push([arr[i].getLeft(), arr[i].getTop()]);
	dist[classes[arr[i].label]] += 1 
    }
    dataset = []
    for(i in dist){
	dataset.push({category: i, measure: dist[i]})
    }

    
    d3.selectAll("svg").remove();
    dsPieChart(dataset);
    //-------------------------------------------------

    //---------------------BAR CHART-------------------    
    bar_data = []
    for(i in ranking){
	bar_data.push({"letter": ranking[i][0], "frequency": ranking[i][1]})
    }

    make_bar_chart(bar_data)
    //-------------------------------------------------    
    
}

socket.on('projection', function(msg) {
    set_view(msg['data'],msg['ranking'],msg['urls'])
});

canvas = new fabric.Canvas('c1', { backgroundColor: "#000" });
var info_array = []

socket.on('connect', function() {});
socket.emit('init_projection', {});

//-------------------------------------GLOBALS------------------
classes = ["unknown","positive-intense","postive-mellow", "negative-intense", "negative-mellow"];
rainbow = ["#ffcc66", "#ccff66", "#66ccff", "#ff6fcf", "#ff6666","#6c6cfc"];
var rankingi, dot, dist={}, dataset=[], bar_data=[];

for (i in classes){
    dist[classes[i]] = 0
}

results1 = document.getElementById('results-c1');
//-------------------------------------------------------------
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

canvas.on('object:moving', function(e) { 
    animate(e, 1);
});

canvas.on('selection:created', function(e) {
    //console.log("selection creatiuans");
    selected = e.target._objects
    //console.log("s",JSON.stringify(selected));
    datatable = []
    for(i in selected){
	temp = []
	index = canvas.getObjects().indexOf(selected[i])
	// desc = info_array[index]
	desc = selected[i].stringValue
	if (index != -1){
	    temp.push(canvas.getObjects()[index].label)
	    temp.push(index)
	    temp.push(desc)
	    datatable.push(temp)
	}
    }
    
    //console.log("datatable1212",JSON.stringify(datatable));
    //createTable(datatable);
    angular.element(document.getElementById('c1')).scope().set_selection(datatable);
})

canvas.on('object:selected', function(e) { 
    //console.log("objecoeije selekcjbeiufr");
    rainbow = angular.element(document.getElementById('c1')).scope().rainbow
    datatable = []
    //console.log("button select",JSON.stringify(e));
    if (canvas.getActiveGroup() != undefined){
	var arr = canvas.getObjects()
	for (i = 0; i < arr.length; i++){
	    if (arr[i].active){
		temp = []
		index = canvas.getObjects().indexOf(arr[i])
		desc = info_array[index]		
		temp.push(arr[i].label)
		temp.push(index)
		temp.push(desc)
		datatable.push(temp)
	    }
	}

    }
    else{

	temp = []
	index = canvas.getObjects().indexOf(e.target)
	desc = info_array[index]
	if (index != -1){
	    temp.push(canvas.getObjects()[index].label)
	    temp.push(index)
	    temp.push(desc)
	    datatable.push(temp)
	}
	

    }
    //console.log("object selected",JSON.stringify(datatable));
    //createTable(datatable);
    angular.element(document.getElementById('c1')).scope().set_selection(datatable);
    
})

canvas.on('object:modified', function(e) {
    // only group selection works right now)
    if (canvas.getActiveGroup() != undefined){
	var arr = canvas.getObjects()
	for (i = 0; i < arr.length; i++){
	    if (arr[i].active){
		arr[i].changed = true;
		//console.log("C",arr[i]);
	    }
	}
    }
    else e.target.changed = true;
});

points = canvas._objects
info = info_array


// for(var i=0; i < points.length; i++){
// }
