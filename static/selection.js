function myFunction(label_class) {

    // console.log(canvas);
    selection = []
    for(var i=0; i < canvas._objects.length; i++){
	
	obj = canvas._objects[i]

	if(obj.label == label_class){
	    // console.log(canvas._objects[i])
	    obj.active = true
	    selection.push(obj)
	}	
    }
    group = new fabric.Group(selection,{originX: 'center', originY:'center'});    
	//console.log(selection.length)
	canvas.setActiveGroup(group).renderAll()
	//canvas.setActiveObject(selection);
}
