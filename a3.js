function visualMap (map, data, keyword, output ){ 

 //  	var countKey = [];
 //  	var max =0;
	// data.forEach(function(o) {
	// 	countKey[o["key"]] = o["value"];
	// 	if(max < o["value"])
	// 		max = o["value"]
	// })

	var countKey = _.countBy(data, keyword);
	console.log(countKey);
	var max = _.max(countKey);

	//console.log(countKey);

    var width = 1200,
	    height = 500;

	var svg = d3.select(output)
			    .append("svg")
			    .attr("width", width)
			    .attr("height", height);

	var color = d3.scaleSequential(d3.interpolateReds);
	
	var projection = d3.geoCylindricalStereographic()
					
	var path = d3.geoPath()
	    		.projection(projection);

	svg.append("defs").append("path")
	    .datum({type: "Sphere"})
	    .attr("id", "sphere")
	    .attr("d", path);

	svg.append("use")
	    .attr("class", "stroke")
	    .attr("xlink:href", "#sphere");

	svg.append("use")
	    .attr("class", "fill")
	    .attr("xlink:href", "#sphere");


	svg.append("g")
	    .selectAll("path")
	    .data(map.features)
	    .enter().append("path")
		    .attr("d", path)
		    .attr("stroke", "#000")
			.attr("stroke-width", 0.75)
			.attr("fill", function(d) { 
	    			//console.log(countKey[d.properties.name]);
	    			if(typeof(countKey[d.properties.name]) !== 'undefined'){
	    				// var x =color(countKey[d.properties.name] / max)
	    				// console.log(x);
	    				return color(countKey[d.properties.name] / max);
	    			}		
	    			else
	    				return "#fff";
	    			
	    	})
}

function drawGraph(info, teammate, out){

	var  nodes = [], links = [];
	var countriesInfo = _.countBy(info, "Nationality")
	var countries = _.map(countriesInfo, function(num, key){return {country:key, number:num}});
	countries = _.sortBy(countries, "number").reverse();
	countries = _.chain(countries).groupBy(function(element, index){return Math.floor(index/9);}).toArray().value()[0];
	countries = _.map(countries, "country");
	countries.push("Other");
	//console.log(countries);

	teammate.map(function(players) {

		players.map(function(name, i) {
			nationality = (_.filter(info, function(o) { return name == o.Name; })[0]["Nationality"]);
			if(!_.contains(countries, nationality))
				nationality = "Other"
			node = { "id": name, "nationality": nationality}
			nodes.push(node);
		});
		//console.log(players[0]);
		link  = { "source": players[0], "target": players[1] };
		links.push(link);

	});
	//console.log(nodes)
	nodes = _.uniq(nodes, "id")
	//console.log(nodes)

	teammate = {
		"nodes": nodes,
		"links": links
	}
	//console.log(teammate)
	//console.log(teammate)

	var width = 1200, height=800;
	var svg = d3.select(out).append("svg")
		.attr("width", width)
		.attr("height", height);

	var color = d3.scaleOrdinal(d3.schemeCategory10);

	var simulation = d3.forceSimulation()
	    .force("link", d3.forceLink().id(function(d) { return d.id; }))
	    .force("charge", d3.forceManyBody())
	    .force("center", d3.forceCenter(width / 2, height / 2));

	simulation.force("charge").strength(-200);

	var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(teammate.links)
    .enter().append("line")
      .attr("stroke-width", 1)
      .attr("stroke", "#4dd2ff");

  	var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(teammate.nodes)
    .enter().append("g")

    node.append("circle")
      .attr("r", 12)
      .attr("fill", function(d) { return color(d.nationality); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))

	node.append("text")
	    .attr("font-size", 11)
	    .text(function(d) { return d.id; })

  	simulation
      .nodes(teammate.nodes)
      .on("tick", ticked);

  	simulation.force("link")
      .links(teammate.links);

    function ticked() {
	    link
	        .attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; })
	    node.select("circle").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	    node.select("text").attr("transform", function(d) { return "translate(" + d.x + 15 + "," + d.y + ")"; })

  	}
  	function dragstarted(d) {
	  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	  d.fx = d.x;
	  d.fy = d.y;
	}

	function dragged(d) {
	  d.fx = d3.event.x;
	  d.fy = d3.event.y;
	}

	function dragended(d) {
	  if (!d3.event.active) simulation.alphaTarget(0);
	  d.fx = null;
	  d.fy = null;
	}

	//draw legend
	var legend = svg.append("g")
	                    .attr("class", "legend")
	                    .selectAll("g")
	                    .data(countries)
	                    .enter().append("g")
	                        .attr("class", function(d) { return d; })
	                        .attr("transform", function(d, i) { return "translate(0," + (i * 10 * 2) + ")"; });

	legend.append("text")
	        .attr("font-size", 12)
	        .attr("x", 20)
	        .attr("y", 15)
	        .text(function(d) { return d; });
	legend.append("circle")
		        .attr("cx", 10)
		        .attr("cy", 10)
		        .attr("r", 10)
		        .attr("fill", color);
}


function changeAttribute(mapData, data, output){

	visualMap(mapData, data, "League", output);

	d3.select("select").on("change", function() {
		d3.select(output).selectAll("svg").remove();
    	if (this.value == "League") {
    		//console.log("League")
    		visualMap(mapData, data, "League", output);
    	} else if (this.value == "Nationality"){
    		//console.log("Nationality")
    		visualMap(mapData, data, "Nationality", output);
    	}
    });

}

function createVis(errors, mapData, womensData, mensData, teammateData)
{
	//Pre-process data
	// var womens = d3.nest(womensData)
 //  		.key(function(d) { return d.Country })
 //  		.rollup(function(v) { return v.length; })
 //  		.entries(womensData);
 
  	//draw map
	// visualMap(mapData, womens, "#womensmap");

	visualMap(mapData, womensData, "Country", "#womensmap")

	//Pre-process data
	// var mens = d3.nest(mensData)
 //  		.key(function(d) { return d.Nationality })
 //  		.rollup(function(v) { return v.length; })
 //  		.entries(mensData);
 //  	//draw map
 //  	visualMap(mapData, mens, "#mensmap" )

 	visualMap(mapData, mensData, "Nationality", "#mensmap")

 	//draw graph
 	drawGraph(mensData, teammateData, "#teammategraph")

 	//extra
 	changeAttribute(mapData, mensData, "#extramap")
	
		    
}

// uncomment the cdn.rawgit.com versions and comment the cis.umassd.edu versions if you require all https data
d3.queue().defer(d3.json, "https://cdn.rawgit.com/johan/world.geo.json/master/countries.geo.json")
    // .defer(d3.json, "http://www.cis.umassd.edu/~dkoop/dsc530-2017sp/a3/fifa-17-women.json")
    .defer(d3.json, "https://cdn.rawgit.com/dakoop/e4fa063e3f3415f3d3c79456bc4b6dc5/raw/a9e01691802c8e70d94ce33a59e98529cc4324af/fifa-17-women.json")
    // .defer(d3.json, "http://www.cis.umassd.edu/~dkoop/dsc530-2017sp/a3/guardian-16-men.json")
    .defer(d3.json, "https://cdn.rawgit.com/dakoop/e4fa063e3f3415f3d3c79456bc4b6dc5/raw/a9e01691802c8e70d94ce33a59e98529cc4324af/guardian-16-men.json")
    // .defer(d3.json, "http://www.cis.umassd.edu/~dkoop/dsc530-2017sp/a3/soccer-teammates-men.json")
    .defer(d3.json, "https://cdn.rawgit.com/dakoop/e4fa063e3f3415f3d3c79456bc4b6dc5/raw/a9e01691802c8e70d94ce33a59e98529cc4324af/soccer-teammates-men.json")
    .await(createVis);

