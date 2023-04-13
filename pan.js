let dx, dy;
const HBAR_W = CHART_W,
      HBAR_H = CHART_H / 10,
      VBAR_W = CHART_W / 15,
      VBAR_H = CHART_H;

const displacement = 20;

const arrowBars = [];

const arrows = [
    { id:"n", label:"&uarr;", dir:[0,-1], xy:[0,0], dim:[HBAR_W, HBAR_H]},
    { id:"s", label:"&darr;", dir:[0,1],  xy:[0,CHART_H - HBAR_H], dim:[HBAR_W, HBAR_H]},
    { id:"e", label:"&rarr;", dir:[1,0], xy:[CHART_W - VBAR_W,0], dim:[VBAR_W, VBAR_H]},
    { id:"w", label:"&larr;", dir:[-1,0], xy:[0, CHART_H - VBAR_H], dim:[VBAR_W, VBAR_H]} 
    ];

function createArrows() {
    arrows.forEach( (arrow, i) => {
        arrowBars[i] = chart.append("g")
                            .classed("arrowBar", true);

        arrowBars[i].append("rect")
                    .attr("x", arrows[i].xy[0])
                    .attr("y", arrows[i].xy[1])
                    .attr("width", arrows[i].dim[0])
                    .attr("height", arrows[i].dim[1]);

        arrowBars[i].append("text")
                    .attr("x", arrows[i].xy[0] + arrows[i].dim[0]/2)
                    .attr("y", arrows[i].xy[1] + arrows[i].dim[1]/2)
                    .html(arrows[i].label);

        arrowBars[i].on("click", (event) => {
                        let [dirX, dirY] = arrows[i].dir; 

                        [dx, dy] = myProj.translate();

                        dx += (dirX * displacement);
                        dy += (dirY * displacement);

                        myProj.translate([dx, dy]);

                        updateMap();
                     });
    });
}

function updateMap() {

    cityData.forEach( (city) => {
        let pt = myProj([city.lon, city.lat]);
        city.x = pt[0];
        city.y = pt[1];
    });

    // update paths d
    groups.selectAll("path")
          .attr("d", genPath);

    // update state names (x, y)
    groups.selectAll("text")
          .attr("transform", (d) => {
              let center = genPath.centroid(d);
              return `translate(${center})`;
           });

    // update city circles
    cities.attr("cx", (city) => city.x)
          .attr("cy", (city) => city.y);
}

function zooming(event) {
    let newScale = event.transform.k * CHART_W;

    myProj.scale(newScale);

    updateMap();

    // Q. how to update city circle radius?
}

function addZoom() {
    chart.call( d3.zoom()
                  .on("zoom", zooming) );
}

function dragging(event) {
    [dx, dy] = myProj.translate();

    dx += event.dx;
    dy += event.dy;

    myProj.translate([dx, dy]);

    updateMap();
}

function addDrag() {
    chart.call( d3.drag()
                  .on("drag", dragging) );
}