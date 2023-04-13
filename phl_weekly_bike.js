const body = d3.select("body");
const barChart2 = body.select("#chart");
const MARGIN = 50;
const CHART_W = parseInt(barChart2.attr("width"));
const CHART_H = parseInt(barChart2.attr("height"));
const BAR_WIDTH = 10;
const H_GAP = 20;

d3.csv("Yearly_bike_riders_phl.csv", (row) => {
    row.year = parseInt(row.year);
    row.bike_mode_share = parseInt(row.bike_mode_share);
    return row;
}).then(function(data) {
    console.log(data);
    let xScale = d3.scaleLinear()
                   .domain([2005, 2020])
                   .range([0, CHART_W - MARGIN]);

    let yScale = d3.scaleLinear()
                   .domain([10000, 50000])
                   .range([CHART_H - MARGIN, 0]);

    let heightScale = d3.scaleLinear()
                        .domain([10000, 50000])
                        .range([0, CHART_H - MARGIN]);

    const xAxis = d3.axisBottom()
                    .ticks(15)
                    .tickFormat(x => parseInt(x))
                    .scale(xScale);

    const yAxis = d3.axisLeft()
                    .ticks(15)
                    .tickFormat((d, i) => i * 5 + "k")
                    .scale(yScale);

    barChart2.append("g")
             .attr("transform", `translate(${MARGIN - 20}, ${CHART_W - MARGIN + 10})`)
             .call(xAxis);

    barChart2.append("g")
             .attr("transform", `translate(${MARGIN - 20}, 10)`)
             .call(yAxis);

    let bars = barChart2.selectAll("rect")
                       .data(data)
                       .enter()
                       .append("rect")
                       .on("mouseover", function(d) {
                            d3.select(this).attr("width", 20)
                                           .style("fill", "teal")
                        })
                       .on("mouseout", function(d) {
                            d3.select(this).attr("width", BAR_WIDTH)
                                           .style("fill", "black")
                        })
                       .transition()
                       .duration(1000)
                       .delay(1000)
                       .ease(d3.easeElasticOut);


    bars.attr("x", (d) => xScale(d.year))
        .attr("y", (d) => yScale(d.bike_mode_share))
        .attr("width", BAR_WIDTH)
        .attr("height", (d) => heightScale(d.bike_mode_share))
        .attr("transform", "translate(30, 10)");

});