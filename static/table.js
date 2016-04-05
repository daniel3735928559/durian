
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


