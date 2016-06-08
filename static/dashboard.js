/*
  ################ FORMATS ##################
  -------------------------------------------
*/

var formatAsPercentage = d3.format("%"),
    formatAsPercentage1Dec = d3.format(".1%"),
    formatAsInteger = d3.format(","),
    fsec = d3.time.format("%S s"),
    fmin = d3.time.format("%M m"),
    fhou = d3.time.format("%H h"),
    fwee = d3.time.format("%a"),
    fdat = d3.time.format("%d d"),
    fmon = d3.time.format("%b")
;

/*
  ############# PIE CHART ###################
  -------------------------------------------
*/

function dsPieChart(dataset){

    var width = 200,
	height = 300,
	outerRadius = Math.min(width, height) / 2,
	innerRadius = outerRadius * .999,
	// for animation
	innerRadiusFinal = outerRadius * .5,
	innerRadiusFinal3 = outerRadius* .45,
	color = d3.scale.category20();//builtin range of colors;

    var rainbow = ["#ffcc66", "#ccff66", "#66ccff", "#ff6fcf", "#ff6666"];
    
    
    var vis = d3.select("#pie")
	.append("svg:svg")              
	.data([dataset])                   //associate our data with the document
	.attr("width", width)           //set the width and height of our visualization (these will be attributes of the <svg> tag
	.attr("height", height)
	.append("svg:g")                //make a group to hold our pie chart
	.attr("id", "pie_svg")
	.attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")    //move the center of the pie chart from 0, 0 to radius, radius
    ;

    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
	.outerRadius(outerRadius)
	.innerRadius(innerRadius);

    // for animation
    var arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
    var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
	.value(function(d) { return d.measure; });    //we must tell it out to access the value of each element in our data array

    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
	.data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
	.enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
	.append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
	.attr("class", "slice")    //allow us to style things in the slices (like text)
	.on("mouseover", mouseover)
	.on("mouseout", mouseout)
	.on("click", up)
    ;

    arcs.append("svg:path")
	.attr("fill", function(d, i) {
	    return rainbow[i];  //set the color for each slice to be chosen from the color function defined above
	})
	.attr("d", arc)     //this creates the actual SVG path using the associated data (pie) with the arc drawing function
	.append("svg:title") //mouseover title showing the figures
	.text(function(d) { return d.data.category + ": " + formatAsPercentage(d.data.measure); });

    d3.selectAll("g.slice").selectAll("path").transition()
	.duration(750)
	.delay(10)
	.attr("d", arcFinal )
    ;

    // Add a label to the larger arcs, translated to the arc centroid and rotated.
    // source: http://bl.ocks.org/1305337#index.html
    arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; })
	.append("svg:text")
	.attr("dy", ".35em")
	.attr("text-anchor", "middle")
	.attr("transform", function(d) { return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")"; })
    //.text(function(d) { return formatAsPercentage(d.value); })
	.text(function(d) { return d.data.category; })
    ;

    // Computes the label angle of an arc, converting from radians to degrees.
    function angle(d) {
	var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
	return a > 90 ? a - 180 : a;
    }

    // Pie chart title
    vis.append("svg:text")
	.attr("dy", ".35em")
	.attr("text-anchor", "middle")
	.text("Class labels")
	.attr("class","title")
    ;



    function mouseover() {
	d3.select(this).select("path").transition()
	    .duration(750)
	    .attr("d", arcFinal3)
	;
    }

    function mouseout() {
	d3.select(this).select("path").transition()
	    .duration(750)
	    .attr("d", arcFinal)
	;
    }

    function up(d, i) {
	/* update bar chart when user selects piece of the pie chart */
	//updateBarChart(dataset[i].category);
	myFunction(i)
    }
}


/*
  ############# BAR CHART ###################
  -------------------------------------------
*/
function dsBarChart(data){
    
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
	width = 500 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "%");

    var svg = d3.select("#bar").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);
    
    svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.text("Frequency");
    
    svg.selectAll(".bar")
	.data(data)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("x", function(d) { return x(d.letter); })
	.attr("width", x.rangeBand())
	.attr("y", function(d) { return y(d.frequency); })
	.attr("height", function(d) { return height - y(d.frequency); });

    function type(d) {
	d.frequency = +d.frequency;
	return d;
    }
}

data =
    [
	{letter: "sad", frequency: 25},
	{letter:"happy", frequency: 36}
    ]

dsBarChart(data)
