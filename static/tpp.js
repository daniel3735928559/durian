fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.hasControls = false;

var old_view = [];

prev_view = null;
current_view = null;
ngscope = null;

$("#label_input").keyup(function (e) {
    if (e.keyCode == 13) {
	angular.element(document.getElementById('c1')).scope().add_label();
    }
});

function save_current_view(){
    var arr = get_normalised_coords(canvas.getObjects());
    for (i = 0; i < arr.length; i++){
	current_view.data[i][0] = arr[i][0];
	current_view.data[i][1] = arr[i][1];
    }

}

function file_upload(e){
    var reader = new FileReader();
    reader.onload = function(e) {
	data = e.target.result.split(",")[1];
	$.ajax({
	    "url":"/dataset",
	    "method":"post",
	    "data":{"dataset":data}
	}).done(function(data){console.log(data);socket.emit('init_projection', {});})
    };
    reader.readAsDataURL(document.getElementById("file_upload").files[0]);
}

function update_view(method){

    d3.select("#bar").remove();    
    classes = controllerScope.scope().$$childHead.classes
    rainbow = controllerScope.scope().$$childHead.rainbow
    save_current_view();
    canvas.deactivateAll();
    var changed = [];
    var view_objs = [];
    var view = [];
    var arr = canvas.getObjects();
    if(method == "lasso"){
	changed = angular.element(document.getElementById('c1')).scope().lasso_changed;
	view = angular.element(document.getElementById('c1')).scope().lasso_view;
	console.log("LASSO",changed, view);
    }
    else{

	for (i = 0; i < arr.length; i++){
	    if(arr[i].changed){
		changed.push(i);
		view_objs.push(arr[i]);
	    }
	}
	view = get_normalised_coords(view_objs);
    }

    var arr = canvas.getObjects();


   
    //------------------BAR CHART--------------
    bar_data = []
    for(i in current_view.ranking){
	bar_data.push({"letter": current_view.ranking[i][0], "frequency": current_view.ranking[i][1]})
    }
    
    make_bar_chart(bar_data)
    //--------------------------------------------------------
    
    //lasso_flag = angular.element(document.getElementById('c1')).scope().lasso 
    socket.emit('get_projection', {'changed':changed,'view':view,'old':old_view, 'algorithm': method, 'params':angular.element(document.getElementById('c1')).scope().get_params()});
}

function get_normalised_coords(objs){
   
    var answer = [];
    console.log(objs.length)
    for(var i = 0; i < objs.length; i++){
	answer.push([(objs[i].getLeft() - canvas.width/2)/(canvas.width/2),(objs[i].getTop()-canvas.height/2)/(canvas.height/2)])
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

function set_view(data, ranking, urls,classes){
    console.log("CLCLCLC",classes);
    var sc = angular.element(document.getElementById('c1')).scope()
    sc.classes = classes;
    sc.$apply();
    
    classes = controllerScope.scope().$$childHead.classes
    
    var visible_indices = map_filter_points(function(i,p){ return i; }, function(i,p){ return p.visible; })
    var temp_visible_indices = map_filter_points(function(i,p){ return i; }, function(i,p){ return p.temp_visible; })
    
    prev_view = current_view;
    current_view = {'data':data,'ranking':ranking};
    var changed = {};
    var arr = canvas.getObjects();
    for(var i = 0; i < arr.length; i++){
	changed[i] = arr[i].changed;
    }
    canvas.clear().renderAll();
    for (i = 0; i < data.length; i++) {

	info_array.push(data[i][3])
	coords = get_display_coords(parseFloat(data[i][0]),parseFloat(data[i][1]));
	// console.log("CC",coords)

	//------------------------- IMAGES--------------------------
	// URL = "static/faces/"+urls[i];//"http://fabricjs.com/lib/pug.jpg"
	// fabric.Image.fromURL(URL, function (dot) {
	//     //oImg.set('left', PosX).set('top',PosY);
	//     canvas.add(dot);
	// }, {"left": coords[0], "top": coords[1], "scaleX": 0.25, "scaleY": 0.25,
	//     "stringValue": data[i][3], "label": data[i][2]});
    	// ----------------------------------------------------------

	var sc = angular.element(document.getElementById('c1')).scope()
	console.log("CCCC",data[i][2],sc.classes[data[i][2]]);
	circle = new fabric.Circle({
	    left:   coords[0],
	    top:    coords[1],
	    radius: 10,
	    fill:   sc.get_rainbow(sc.classes[data[i][2]]) //rainbow[data[i][2]
	});


	text = new fabric.Text(data[i][3],{
	    left:   coords[0]+2*10,
	    top:    coords[1],
	    fontFamily: 'Delicious',
	    fill: '#f55',
	    fontSize: 22
	    
	});

	var dot = new fabric.Group([circle, text]);

	// dot.setOriginX("center");
	// dot.setOriginY("center");
	dot.hasControls = false;
	dot.visible = false;
	dot.temp_visible = false;
	dot.stringValue = data[i][3];
	dot.label = data[i][2];
	dot.changed = changed[i];
	canvas.add(dot);
    }
    
    map_filter_points(function(i,p){ p.visible = true; },
		      function(i,p){ return visible_indices.indexOf(i) >= 0; });
    
    map_filter_points(function(i,p){ p.temp_visible = true; },
		      function(i,p){ return temp_visible_indices.indexOf(i) >= 0; });
    canvas.renderAll();
    
    //---------------------PIE CHART-------------------
    //-------------------------------------------------

    //---------------------BAR CHART-------------------    
    bar_data = []
    for(i in ranking){
	bar_data.push({"letter": ranking[i][0], "frequency": ranking[i][1]})
    }
    make_bar_chart(bar_data)
    //-------------------------------------------------    
    
}

socket.on('new_points', function(msg) {
    // console.log("ASD",msg);
    map_filter_points(function(i,p){ if(msg.visible_indices.indexOf(i) >= 0) p.visible = true; },
		      function(i,p){return true;});
    
    canvas.renderAll();
});

socket.on('projection', function(msg) {
    set_view(msg['data'],msg['ranking'],msg['urls'],msg['classes'])
});

canvas = new fabric.Canvas('c1', { backgroundColor: "#000" });
var info_array = []

socket.on('connect', function() {});
socket.emit('init_projection', {});

//-------------------------------------GLOBALS------------------

var controllerElement = document.querySelector('body');
var controllerScope = angular.element(controllerElement)

classes = null;
rainbow = null;

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

function map_filter_points(map,filter) {
    var arr = canvas.getObjects();
    var ans = [];
    for(var i = 0; i < arr.length; i++){
	if(filter(i,arr[i])){
	    ans.push(map(i,arr[i]));
	}
    }
    return ans;
}

showing_all = false;

function toggle_show_all(){
    showing_all = !showing_all;
    console.log(showing_all);
    if(showing_all)
	map_filter_points(function(i,p){ console.log("P",p.visible); p.temp_visible = !p.visible; p.visible = true; },
			  function(i,p){ return true; })
    else
	map_filter_points(function(i,p){ if(p.temp_visible) p.visible = false; },
			  function(i,p){ return true; })
    canvas.renderAll();
}

function request_points(n) {
    var vi = map_filter_points(function(i,p){return i;},
			       function(i,p){return p.visible;})
    console.log("VIVIV",vi);
    socket.emit('request_points', {'visible_indices':vi,'algorithm':'random','num':n});
}

function add_new_class(word){
    console.log(word);
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
    ngscope = ngscope || angular.element(document.getElementById('c1')).scope();
    // only group selection works right now)
    if (canvas.getActiveGroup() != undefined){
	var arr = canvas.getObjects()
	for (i = 0; i < arr.length; i++){
	    if (arr[i].active){
		arr[i].changed = true;
		ngscope.training_update(false);
		//console.log("C",arr[i]);
	    }
	}
    }
    else{
	e.target.changed = true;
	ngscope.training_update(false);
    }
});

points = canvas._objects
info = info_array


// for(var i=0; i < points.length; i++){
// }
