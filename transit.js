const body = d3.select("body");
const chart = body.select("svg");

const CHART_W = parseInt(chart.attr("width"));
const CHART_H = parseInt(chart.attr("height"));

const CHART_CX = CHART_W / 2;
const CHART_CY = CHART_H / 2;

const myProj = d3.geoAlbersUsa()
                 .translate([CHART_CX, CHART_CY])
                 .scale(CHART_W);

const genPath = d3.geoPath()
                  .projection( myProj );

const MIN_R = 10, MAX_R = 30;

const mapFN = "us_states.json";
const ridershipFN = "ridership-by-state.csv";
const cityFN = "cities.csv";

let promises = [ d3.json(mapFN),
                 d3.csv(ridershipFN),
                 d3.csv(cityFN, (row) => {
                     row.population = parseInt(row.population);
                     row.lat = parseFloat(row.lat);
                     row.lon = parseFloat(row.lon);

                     let point = myProj([row.lon, row.lat]);
                     row.x = point[0];
                     row.y = point[1];

                     return row;
                 }) ];

let fulfilled = Promise.all(promises);

let mapData, ridershipData, cityData;

let groups, cities;

const divTip = body.append("div")
                   .attr('id', 'tooltip')
                   .attr("style", "position: absolute; opacity: 0;")
                   .style("background-color", "white")
                   .style("border", "solid")
                   .style("border-width", "1px")
                   .style("border-radius", "5px")
                   .style("padding", "10px")
                   .classed("tooltip", true);

fulfilled.then( (allData) => {

    mapData = allData[0];
    ridershipData = allData[1];
    cityData = allData[2];

    for (let i = 0; i < ridershipData.length; ++i) {
        let ab = ridershipData[i].state_abbr;
        ridershipData[i].percentage_rider = parseInt(ridershipData[i].percentage_rider);

        let percentage = ridershipData[i].percentage_rider;

        let state = mapData.features[i].properties;

        state.abbr = ab;
        state.ridership = percentage;
    }

    let greenScale = d3.scaleLinear()
                       .domain(d3.extent(ridershipData, (row) => row.percentage_rider))
                       .range([50, 255]);

    let radiusScale = d3.scaleLinear()
                        .domain(d3.extent(cityData, (row) => row.population))
                        .range([MIN_R, MAX_R]);

    function getColor(state) {
        let g = greenScale(state.properties.ridership);
        return `rgb(0, ${g}, 0)`;
    }

    groups = chart.selectAll("g")
                      .data( mapData.features )
                      .enter()
                      .append("g");

    groups.append("path")
          .attr("d", genPath)
          .attr("fill", (d) => getColor(d))
          .attr("stroke", "orange");


    cities = chart.selectAll("circle")
                  .data(cityData)
                  .enter()
                  .append("circle")
                  .attr("r", (d) => radiusScale(d.population))
                  .attr("cx", (d) => d.x)
                  .attr("cy", (d) => d.y)


    cities.style("stroke", "purple")
          .style("fill", "purple")
          .style("opacity", 0.5)
          .style("stroke-width", 2)
          .append("title").text((d) => d.place + ": " + d.rank + " rank in most people using public transit");

    createArrows();

    addDrag();

    addZoom();
});