## Data Visualization (DSC 530/602-02) Assignment 3

## Instructor: Professor [David Koop (http://www.cis.umassd.edu/~dkoop/)

## Goals
Learn to create network and map visualizations using D3 and apply colormaps to a map visualization.

## Instructions
There are three parts to the assignment. You may complete the assignment in a single HTML file or use multiple files (e.g. one for CSS, one for HTML, and one for JavaScript). **You must use D3 v4 for this assignment**. All visualization should be done using D3 calls. You may use other libraries (e.g. underscore.js or jQuery), but you must credit them in the HTML file you turn in. Extensive [documentation for D3](https://github.com/mbostock/d3/wiki) is available, and [Vadim Ogievetsky's example-based introduction](https://dakoop.github.io/IntroD3) that we went through in class is also a useful reference. In addition, Scott Murray has written a great book named [Interactive Data Visualization for the Web](http://chimera.labs.oreilly.com/books/1230000000345), but *this was written for D3 v3*.

## Due Date
The assignment is due at 11:59pm on Wednesday, March 29.

## Submission
You should submit any files required for this assignment on [myCourses](https://webapps.umassd.edu/myumd/bblearn/?crs=myinstitution). You may complete the assignment in a single HTML file or use multiple files (e.g. one for HTML, one for CSS, and one for JavaScript). Note that the files should be linked to the main HTML document accordingly. The filename of the main HTML document should be `a3.html`. myCourses may complain about the files; if so, please zip the files and submit the zip file instead.

## Details
In this assignment, we will examine the world's top soccer players, both in the men's game and the women's game. We will look at the geographic distribution via maps as well as a teammate graph. The data for the top women is gathered from the [FIFA 2017 Player Ratings](https://www.easports.com/fifa/news/2016/fifa-17-player-ratings-top-20-women) published by EA Sports. The data for the top men is gathered from the [Guardian's 100 best footballers in the world 2016](https://www.theguardian.com/football/ng-interactive/2016/dec/20/the-100-best-footballers-in-the-world-2016-interactive). Both data sets have been cleaned and put into JSON format. We will use the annotated world country boundaries in GeoJSON format via the [world.geo.json GitHub repository](https://github.com/johan/world.geo.json) to draw the maps. Finally, the teammate graph information was extracted via Wikipedia's infoboxes for the Top 100 men. A link exists when a player played on the same team (club or national team) as another player in the same year. (Note that this may not be totally accurate.)

### Data Links

- Top 20 Women's Players: http://www.cis.umassd.edu/~dkoop/dsc530-2017sp/a3/fifa-17-women.json
- Top 100 Men's Players: http://www.cis.umassd.edu/~dkoop/dsc530-2017sp/a3/guardian-16-men.json
- Teammate Data: http://www.cis.umassd.edu/~dkoop/dsc530-2017sp/a3/soccer-teammates-men.json
- World Map: https://cdn.rawgit.com/johan/world.geo.json/master/countries.geo.json

### HTTPS Versions

- Top 20 Women's Players: https://cdn.rawgit.com/dakoop/e4fa063e3f3415f3d3c79456bc4b6dc5/raw/a9e01691802c8e70d94ce33a59e98529cc4324af/fifa-17-women.json
- Top 100 Men's Players: https://cdn.rawgit.com/dakoop/e4fa063e3f3415f3d3c79456bc4b6dc5/raw/a9e01691802c8e70d94ce33a59e98529cc4324af/guardian-16-men.json
- Teammate Data: https://gist.githubusercontent.com/dakoop/e4fa063e3f3415f3d3c79456bc4b6dc5/raw/a9e01691802c8e70d94ce33a59e98529cc4324af/soccer-teammates-men.json
- World Map: https://cdn.rawgit.com/johan/world.geo.json/master/countries.geo.json

### 0. Info
Like Assignment 1, start by creating an HTML web page with the title "Assignment 3". It should contain the following text:

- Your name
- Your student id
- The course title ("Data Visualization (DSC 530/CIS 602-02)"), and
- The assignment title ("Assignment 3")
- The text "This assignment is all my own work. I did not copy the code from any other source." (Your inclusion of this text indicates that you understand the consequences of violating the [UMass Dartmouth Student Academic Integrity Policy](http://www.umassd.edu/studentaffairs/studenthandbook/academicregulationsandprocedures/).)

If you used any additional JavaScript libraries, please append a note to this section indicating their usage to the text above (e.g. "I used the [jQuery](http://jquery.com/) library to write callback functions.") Include links to the projects used. You do not need to adhere to any particular style for this text, but I would suggest using headings to separate the sections of the assignment.

A template for the assignment is provided: [HTML](http://www.cis.umassd.edu/~dkoop/dsc530-2017sp/a3/a3.html), [JS](http://www.cis.umassd.edu/~dkoop/dsc530-2017sp/a3/a3.js); save them both as source. You may use this or create your own files.

### 1. Top 20 Women's Soccer Players (30 pts)
Create a choropleth map that shows the number of top women's players in each country using the FIFA data and the countries.geo.json file. Use a sequential color scale to indicate the number of players from each country.

Remember that you will need to choose a projection for the map. D3 includes a number of [standard projections](https://github.com/d3/d3-geo#projections) in the default bundle, but you may also use those from [d3-geo-projection](https://github.com/d3/d3-geo-projection). *Note that d3-geo-projection requires an extra JavaScript library to be loaded*. You may choose the projection, but it must show the entire world. The countries.geo.json file contains a three-character `id` attribute for each feature (which in this file is a country's boundary). It also provides a longer `name` attribute in the `properties` object of the feature. Given a feature `d`, we can access the country's name via `d.properties.name`.

You will need to generate the counts of Top 20 players for each country. The fifa-17-women.json file has an object for each player with three properties: `Name`, `Rating`, and `Country`. You may use an object or a `d3.map` to generate these counts. The `Country` attribute will match a feature's name property (as described above) in the countries.geo.json file.

For the map, you will want to use each country as a separate feature. Thus, instead of mapping all of the data using the `.datum(mapData)` as we did in class, you should use  `mapData.features` with the normal selection plus data binding. Each feature will have an `id` attribute that can be used with the counts to derive the fill color.

Finally, to load multiple external data files using D3, use the [queue](https://github.com/d3/d3-queue) library by Mike Bostock. This is part of the default D3 v4 bundle so you do not need to add another JavaScript libraries (as you did with D3 v3) Then, to load the three JSON files file1.json, file2.json, and file3.json:

    function processData(errors, file1data, file2data, file3data) {
        // code
    }

    d3.queue()
        .defer(d3.json, "http://example.com/path/to/file1.json")
        .defer(d3.json, "http://example.com/path/to/file2.json")
        .defer(d3.json, "http://example.com/path/to/file3.json")
        .await(processData);

![Example Solution for Part 1](http://www.cis.umassd.edu/~dkoop/dsc530-2017sp/a3/solution-part1.png)

*Example Solution for Part 1*

##### Hints

- Each country is a feature so if `mapData` is the variable loaded by `d3.json`, `mapData.features` is a list of all of the states (and territories).
- Remember that `d3.geoPath` can have an associated projection and can be used to translate GeoJSON features into paths on screen.
- `d3.scaleSequential` can help with colormapping. Remember to check the type of the values you are displaying to determine a correct colormap.

### 2. Top 100 Men's Soccer Players (30 pts)
Create a second choropleth map that shows the number of top men's players in each country using The Guardian's data in guardian-16-men.json and the same countries.geo.json file. The men's data has the fields: Name, Age, Club, League, Nationality, Position, and Rank. **Important**: To map to a country, use the Nationality field (different from the women's data).

Most of this visualization will overlap with the logic for Part 1. Create a function that will draw a map and has parameters for the data, divId, etc., that can be called for **both** Part 1 and Part 2. You will lose 6 points if you do not have such a reusable function.

### 3. Teammate Graph (55 pts)
Now, we wish to understand relationships between different players based on the teams they have played on. In the soccer-teammates-men.json file, we have an array of arrays where each inner array has two player names, indicating they were teammates. Generate a visualization that shows a force-directed graph whose nodes are the players and where an edge exists between two players if they ever played on the same team. You may draw the nodes however you wish, but the name of the player should be displayed for each node.

The node-link visualization of the network should use D3's [forceSimulation](https://github.com/d3/d3-force#simulation). Note that the simulation requires each node to be an object so that it may populate information about the location of the nodes (`x` and `y`). In addition, each link must be an **object** that has `source` and `target` properties whose value is the index of the node object in the nodes array or some other identifying key that is specified via the [id accessor](https://github.com/d3/d3-force#link_id). There are a number of other parameters/functions that you can use to modify how the force-directed layout works (e.g. charge, center).

Color each node according to nationality. You will need to use both the guardian-16-men.json data to obtain this information. In addition, you should use an Other category so there are **at most 10** colors used. Create a legend that specifies the name of each country corresponding to the color. You should see some clustering of colors since most players of the same nationality also play on the same national team.

##### Hints

- An [example](https://bl.ocks.org/mbostock/4062045) you can build from.
- The node and link arrays you pass to the force layout are different variables from the circles and lines you draw as a node-link diagram.
- Use `d3.scaleOrdinal` and one of the category schemes (e.g. `d3.schemeCategory10`) to map the nationality

### Extra Credit
Create a new visualization that uses other attributes from the guardian-16-mens.json data to improve on the geographic visualization or the network visualization (or both). Note that you must build on some geospatial or network encoding but encode other attributes.
