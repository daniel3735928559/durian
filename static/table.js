
function createTable(tableData) {

    // element = document.getElementById("datatable");
    // element2 = document.getElementById("datatable-body");
    $("#datatable").remove();
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');	
    table.setAttribute("id", "datatable")
    
    tableData.forEach(function(rowData) {
	var row = document.createElement('tr');
	
	rowData.forEach(function(cellData) {
	    var cell = document.createElement('td');
	    cell.appendChild(document.createTextNode(cellData));
	    row.appendChild(cell);
	});
	
	tableBody.appendChild(row);
    });


    table.appendChild(tableBody);
    document.body.appendChild(table);

}

//console.log(info_array)
//data = [["Lionel Messi", "Rondaldo"], ["Ozil", "Zidane"]]
//createTable(data);
//data.push(["New stuff", "yayyy"])
//createTable(data);
//data.push(["New stuff", "yayyy"])
//createTable(data);
